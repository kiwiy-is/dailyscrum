import { Button } from "ui/button";
import Link from "next/link";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import { cn } from "ui";
import Image from "next/image";

const h1 = () => {
  return "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";
};

const h2 = () => {
  return "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0";
};

const h3 = () => {
  return "scroll-m-20 text-2xl font-semibold tracking-tight";
};

const h4 = () => {
  return "scroll-m-20 text-xl font-semibold tracking-tight";
};

const p = () => {
  return "leading-7 [&:not(:first-child)]:mt-6";
};

const blockquote = () => {
  return "border-l-2 pl-6 italic";
};

const ul = () => {
  return "my-6 ml-6 list-disc [&>li]:mt-2";
};

const inlineCode = () => {
  return "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold";
};

const lead = () => {
  return "text-xl text-muted-foreground";
};

const large = () => {
  return "text-lg font-semibold";
};

const small = () => {
  return "text-sm font-medium leading-none";
};

const muted = () => {
  return "text-sm text-muted-foreground";
};

type Props = {
  searchParams: { ["no-tracking"]: string | undefined };
};

const Page = ({ searchParams }: Props) => {
  const noTrackingQuery = searchParams["no-tracking"];
  const noTracking = noTrackingQuery
    ? decodeURIComponent(noTrackingQuery) === "true"
    : false;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className=" ">
        <div className="flex items-center justify-between px-4 md:!px-8 py-[10px] md:!py-6">
          <div className="flex h-9 items-center">
            <Link href="/" className="">
              <div className="flex gap-x-1 items-center">
                <KiwiyIsSymbol width={24} height={24} fill="currentColor" />
                <div className="flex gap-x-1">
                  <div className="text-md leading-none tracking-tight font-normal">
                    Kiwiy
                  </div>{" "}
                  <div className="text-md leading-none tracking-tight font-bold">
                    Daily Scrum
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex gap-x-2">
            {/* TODO: Check if user is signed in */}
            {false ? (
              <Button>Go to Workspace</Button>
            ) : (
              <>
                <Button variant="outline" className="hidden md:!block">
                  <a href="/app/sign-in">Sign in</a>
                </Button>
                <Button>
                  <a href="/app/sign-up">Get Started</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 md:!px-8">
        <section className="py-10 max-w-4xl mx-auto">
          <div className="space-y-6 text-center pt-10">
            <h1 className={cn(h1(), "")}>
              Minimalist daily scrum board <br className="hidden md:!block" />{" "}
              for your team
            </h1>
            <p className={cn(p(), "")}>
              Share your updates in seconds, and keep daily team status in sync
              with a dedicated workspace board.
              <br className="hidden md:!block" /> All features are free!
            </p>
            <Button size="lg" className="w-full md:!w-auto" asChild>
              <a href="/app">Get Started</a>
            </Button>
          </div>
        </section>

        <section className="pb-10 max-w-6xl mx-auto">
          <div className=" text-center">
            <Image
              className="border rounded-md shadow-2xl md:!hidden " //  md:!hidden
              src="/product-preview-c.png"
              width={735}
              height={735}
              quality={100}
              alt="A Kiwiy Daily Scrum product preview"
            />

            <Image
              className="border rounded-md shadow-2xl hidden md:!block lg:!hidden" // hidden md:!block lg:!hidden
              src="/product-preview-b.png"
              width={959}
              height={720}
              alt="A Kiwiy Daily Scrum product preview"
              quality={100}
            />

            <Image
              className="rounded-md shadow-2xl border border-slate-200/65 hidden lg:!block"
              src="/product-preview-a.png"
              width={1152}
              height={648}
              alt="A Kiwiy Daily Scrum product preview"
              quality={100}
            />
          </div>
        </section>

        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto">
          <div className="text-left">
            <h2 className={cn(h2(), "font-bold")}>How it works</h2>

            <h3 className={cn(h3(), "mt-8")}>Step 1. Invite your team</h3>
            <p className={cn(p(), "")}>
              Create a workspace and bring your team together. You can invite
              them with an invitation link.
            </p>

            <h3 className={cn(h3(), "mt-8")}>Step 2. Add updates</h3>
            <p className={cn(p(), "")}>
              {/* Answer daily scrum questions and add your responses to the board. */}
              Answer daily scrum questions. Your responses will be automatically
              added to the board.
            </p>

            <h3 className={cn(h3(), "mt-8")}>
              {/* Step 3. Use in daily scrum meetings */}
              Step 3. Use the board in meeting
            </h3>
            <p className={cn(p(), "")}>
              Share the board during the meeting and see all updates in one
              place. Adjust plans and discuss blockers.
            </p>
          </div>
        </section>

        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto">
          <div className="text-left">
            <h2 className={cn(h2(), "font-bold")}>Key features</h2>

            <h3 className={cn(h3(), "mt-8")}>
              Centralized realtime board view
            </h3>

            <p className={cn(p(), "")}>
              See all team updates at a glance on the realtime board. It helps
              keep everyone informed.
            </p>

            <h3 className={cn(h3(), "mt-8")}>Question form for quick update</h3>
            <p className={cn(p(), "")}>
              Fill out the form with tailored questions for a daily scrum
              update.
            </p>

            <h3 className={cn(h3(), "mt-8")}>
              Custom question templates (Coming Soon)
            </h3>

            <p className={cn(p(), "")}>
              In the near future, you{`'`}ll be able to edit daily scrum
              questions to fit your team{`'`}s needs.
            </p>
          </div>
        </section>

        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto">
          <div className="text-left">
            <h2 className={cn(h2(), "font-bold")}>Free and open source</h2>

            <h3 className={cn(h3(), "mt-8")}>Enjoy all features for free</h3>
            <p className={cn(p(), "")}>
              Kiwiy Daily Scrum is entirely free to use. We hope to promote the
              overall happiness of the community by offering valuable tools at
              no cost.
            </p>

            <h3 className={cn(h3(), "mt-8")}>Open source for the community</h3>

            <p className={cn(p(), "")}>
              Kiwiy Daily Scrum is an open-source project built by and for the
              community. This means you can use it freely and benefit from
              continuous improvements by the community.
            </p>
          </div>
        </section>

        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto ">
          <div className="text-left space-y-6">
            <h2 className={cn(h1(), " !text-[40px]")}>
              Make your team{`'`}s daily scrum minimal
            </h2>

            <p className={cn(p(), "")}>
              Easily share updates, keep everyone on the same page, and enjoy
              all features for free.
              <br />
              Start today!
            </p>

            <Button size="lg" className="w-full md:!w-auto" asChild>
              <a href="/app">Get Started</a>
            </Button>
          </div>
        </section>
        <div className="h-28"></div>
      </main>

      <footer>
        <section className="flex items-center justify-between px-4 md:!px-8 py-[10px] md:!py-6">
          <p className={cn(muted(), "")}>
            Built by{" "}
            <a
              href="https://github.com/kiwiy-is"
              target="_blank"
              className="underline"
            >
              Kiwiy
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/hyukkwonepic"
              target="_blank"
              className="underline"
            >
              hyukkwonepic
            </a>
            . The source code is available{" "}
            <a
              href="https://github.com/kiwiy-is/dailyscrum"
              target="_blank"
              className="underline"
            >
              here
            </a>
            .
          </p>
        </section>
      </footer>
    </div>
  );
};

export default Page;
