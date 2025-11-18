// app/(frontend)/prediction/[eventId]/page.tsx
import Article from "@/components/prediction/Article";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Define the data types
export type DetailOutcome = {
  id: string;
  name: string;
  price: number;
  point: number | null;
};

export type DetailMarket = {
  id: string;
  key: string;
  lastUpdate: string;
  outcomes: DetailOutcome[];
};

export type DetailBookmaker = {
  id: string;
  key: string;
  title: string;
  lastUpdate: string;
  markets: DetailMarket[];
};

export type DetailPrediction = {
  id: number;
  heading: string;
  description: string;
  oddsEventId: string;
  createdAt: string;
  updatedAt: string;
};

export type DetailEvent = {
  id: string;
  sportKey: string;
  sportTitle: string;
  commenceTime: string;
  homeTeam: string;
  awayTeam: string;
  bookmakers: DetailBookmaker[];
  eventpredictions: DetailPrediction[];
};

// Server-side data fetching directly in the component (without getServerSideProps)
const EventPredictionPage = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  // Await the `params` promise
  const { eventId } = await params;

  if (!eventId) {
    // Return an error message if eventId is missing
    return (
      <div className="text-center">
        <p>No event ID provided in the URL.</p>
      </div>
    );
  }

  try {
    // Fetch the event data using Prisma directly
    const eventData = await prisma.oddsEvent.findUnique({
      where: { id: eventId }, // Ensure eventId is passed correctly as the `id`
      include: {
        bookmakers: {
          include: {
            markets: {
              include: {
                outcomes: true,
              },
            },
          },
        },
        eventpredictions: true,
      },
    });

    if (!eventData) {
      // Handle case where no event is found for the provided eventId
      return notFound(); // Redirect to a 404 page if no data is found
    }

    // Map event data and convert `commenceTime` to string
    const formattedEventData: DetailEvent = {
      ...eventData,
      commenceTime: eventData.commenceTime.toISOString(), // Convert Date to string
      bookmakers: eventData.bookmakers.map((bookmaker) => ({
        ...bookmaker,
        lastUpdate: bookmaker.lastUpdate.toISOString(), // Convert Date to string
        markets: bookmaker.markets.map((market) => ({
          ...market,
          lastUpdate: market.lastUpdate.toISOString(), // Convert Date to string
          outcomes: market.outcomes.map((outcome) => ({
            ...outcome,
            point: outcome.point ?? null, // Ensure `point` is properly typed
          })),
        })),
      })),
      eventpredictions: eventData.eventpredictions.map((prediction) => ({
        ...prediction,
        createdAt: prediction.createdAt.toISOString(), // Convert Date to string
        updatedAt: prediction.updatedAt.toISOString(), // Convert Date to string
      })),
    };

    // Return the server-rendered component with the formatted data
    return (
      <main className="w-full bg-[#FAFAFA] min-h-screen">
        <section className="w-full py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Pass the formatted data to the Article component */}
            <Article event={formattedEventData} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching event data:", error);
    return (
      <div className="text-center">
        <p>Error loading event data. Please try again later.</p>
      </div>
    );
  }
};

export default EventPredictionPage;
