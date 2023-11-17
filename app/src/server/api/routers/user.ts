import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getEmail } from "~/server/config/email";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.optional(z.string()),
        username: z.optional(z.string()),
        image: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.username) {
        const existingUser = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });
        // TODO: find a better way to do this
        // (maybe send in only dirty values from the client)
        if (existingUser && existingUser.id != ctx.session.user.id) {
          throw new TRPCError({
            message: "Username is already taken.",
            code: "CONFLICT",
          });
        }
      }
      return await ctx.prisma.user.update({
        data: {
          ...(input.username && {
            username: input.username,
          }),
          ...(input.name && {
            name: input.name,
          }),
          ...(input.image && {
            image: input.image,
          }),
        },
        where: { id: ctx.session.user.id },
      });
    }),

  requestEmailChange: protectedProcedure
    .input(z.object({ newEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.newEmail },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Requested email is already in use.",
        });
      }

      const changeToken = nanoid(18);
      const changeUrl = new URL("/auth/email/change", env.NEXTAUTH_URL);
      changeUrl.searchParams.append("changeToken", changeToken);
      changeUrl.searchParams.append("newEmail", input.newEmail);

      const email = getEmail();

      await email.send({
        template: "email-change",
        message: { to: input.newEmail },
        locals: {
          changeUrl: changeUrl.toString(),
        },
      });

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          emailChange: input.newEmail,
          emailChangeToken: changeToken,
          emailChangeSentAt: new Date(),
        },
      });
    }),

  changeEmail: protectedProcedure
    .input(z.object({ changeToken: z.string(), newEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          emailChange: input.newEmail,
          emailChangeToken: input.changeToken,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not change email. Please try again later.",
        });
      }
      // update user email
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          email: input.newEmail,
          emailChange: null,
          emailChangeToken: null,
          emailChangeSentAt: null,
        },
      });
      // TODO: update Oauth providers here?
    }),
});
