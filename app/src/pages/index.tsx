import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import HomeLayout from "~/components/home/layout";
import { SearchProvider } from "~/components/home/search-provider";
import LoadingScreen from "~/components/loading-screen";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { withAuth } from "~/components/with-auth";
import { APP_DESCRIPTION, APP_NAME } from "~/utils/constants";
import { cn } from "~/utils/style";

const createTripSchema = z.object({
  destination: z.string(),
  startDate: z.any(),
  endDate: z.any(),
  budget: z.any(),
  peopleType: z.any(),
  tripType: z.any(),
  minPlaceRating: z.any(),
  preferredCommute: z.any(),
});

function HomePage() {
  const { data: session } = useSession();

  const router = useRouter();

  const form = useForm<z.infer<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      destination: "",
      budget: [],
    },
  });

  async function onSubmit(values: z.infer<typeof createTripSchema>) {
    // create trip here
    await router.push("/trips/sample");
  }

  if (!session) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeLayout session={session}>
        <SearchProvider>
          <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-6 overflow-y-auto px-4">
            <div className="flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black">
                  Welcome, {session.user.name || session.user.username}
                </h1>
                <h2 className="text-xl font-normal">Let's plan your trip!</h2>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex max-w-xl flex-col gap-6"
                >
                  <FormField
                    name="destination"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where do you want to go?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-between">
                    <FormField
                      name="startDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  {...field}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="endDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  {...field}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="budget"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>$0 - $10,00,000</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="peopleType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                defaultValue="solo"
                                placeholder="Number of people"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solo">
                                Solo (1 person)
                              </SelectItem>
                              <SelectItem value="couple">
                                Couple (2 people)
                              </SelectItem>
                              <SelectItem value="family">
                                Family (3-8 people)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="tripType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>Trip Genre</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="multiple"
                            className="justify-between"
                            {...field}
                          >
                            <ToggleGroupItem value="relaxed">
                              Relaxed
                            </ToggleGroupItem>
                            <ToggleGroupItem value="adventurous">
                              Adventurous
                            </ToggleGroupItem>
                            <ToggleGroupItem value="romantic">
                              Romantic
                            </ToggleGroupItem>
                            <ToggleGroupItem value="pilgrimage">
                              Pilgrimage
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="minPlaceRating"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>Minimum Place Rating</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[4]}
                            max={5}
                            step={1}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>1 star - 5 stars</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="preferredCommute"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>Preferred Mode of Commute</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="multiple"
                            className="justify-between"
                            {...field}
                          >
                            <ToggleGroupItem value="walk">Walk</ToggleGroupItem>
                            <ToggleGroupItem value="car">Car</ToggleGroupItem>
                            <ToggleGroupItem value="bike">Bike</ToggleGroupItem>
                            <ToggleGroupItem value="metro">
                              Metro
                            </ToggleGroupItem>
                            <ToggleGroupItem value="bus">Bus</ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                  >
                    Plan your trip
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </SearchProvider>
      </HomeLayout>
    </>
  );
}

export default withAuth(HomePage);
