import { useSession } from "next-auth/react";
import Head from "next/head";
import HomeLayout from "~/components/home/layout";
import { SearchProvider } from "~/components/home/search-provider";
import { Icons } from "~/components/icons";
import LoadingScreen from "~/components/loading-screen";
import { Button } from "~/components/ui/button";
import { withAuth } from "~/components/with-auth";
import { APP_DESCRIPTION, APP_NAME } from "~/utils/constants";

function TripPage() {
  const { data: session } = useSession();

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
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <h1 className="text-4xl font-black">A week in Kuala Lumpur</h1>
              <h2 className="text-xl font-normal">8th Sep - 15th Sep 2023</h2>
            </div>
            <div className="flex items-center justify-center">
              <Button className="flex gap-2">
                <Icons.penBox />
                regenerate trip
              </Button>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl py-12">
              <h1 className="text-2xl font-black">Trip Summary</h1>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-md font-bold">Estimated Cost</h2>
                <h3 className="text-sm">$7,586</h3>
              </div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-md font-bold">Places to Visit</h2>
                <h3 className="text-sm">Twin Towers, Batu Caves</h3>
              </div>
            </div>
            <div className="flex w-full flex-col py-36">places go here</div>
          </div>
        </SearchProvider>
      </HomeLayout>
    </>
  );
}

export default withAuth(TripPage);
