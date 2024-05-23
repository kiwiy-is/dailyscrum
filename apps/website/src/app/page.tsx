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

const Page = () => {
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
        </div>
      </header>

      <main className="flex-grow px-4 md:!px-8">
        <section className="py-10 max-w-3xl mx-auto">
          <div className="space-y-6 text-center pt-10">
            <h1 className={cn(h1(), "")}>
              Share updates in seconds, <br className="hidden md:!block" />
              streamline team{`'`}s daily scrum
            </h1>
            <p className={cn(p(), "")}>
              Quickly share your own updates in seconds, and easily track your
              team{`'`}s status on our dedicated workspace board - and it{`'`}s
              free!
            </p>
            <Button size="lg" className="w-full md:!w-auto" asChild>
              <Link href="/app">Get Started</Link>
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
            <h2 className={cn(h2(), "font-bold")}>
              Convenient daily scrum, in a collaborative way
            </h2>

            <h3 className={cn(h3(), "mt-8")}>
              Quickly share your updates without hassle
            </h3>
            <p className={cn(p(), "")}>
              No more copying and pasting the daily scrum template into Slack.
              Simply answer the ready-made questions to save time and effort,
              quickly filling in your daily scrum updates without having to type
              out the questions yourself.
            </p>

            <h3 className={cn(h3(), "mt-8")}>
              See your team{`'`}s updates at a glance
            </h3>

            <p className={cn(p(), "")}>
              View all team updates organized in one place for faster status
              checks. Focus on teammates{`'`} blockers and assist them promptly.
              The clear board view helps ensure everyone stays informed and
              collaborative.
            </p>
          </div>
        </section>

        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto">
          <div className="text-left">
            <h2 className={cn(h2(), "font-bold")}>How it works</h2>

            <h3 className={cn(h3(), "mt-8")}>
              Step 1. Invite your team to the workspace
            </h3>
            <p className={cn(p(), "")}>
              Bring your team together in a dedicated workspace.
            </p>

            <h3 className={cn(h3(), "mt-8")}>Step 2. Add your updates</h3>
            <p className={cn(p(), "")}>
              Answer the daily scrum questions and easily share your response by
              adding it to the team board.
            </p>

            <h3 className={cn(h3(), "mt-8")}>
              Step 3. Use the board in daily scrum meetings
            </h3>
            <p className={cn(p(), "")}>
              View all team updates in one organized place. Inspect progress,
              adjust the Sprint Backlog, and plan the next day{`'`}s work during
              the meeting.
            </p>
          </div>
        </section>
        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto">
          <div className="text-left">
            {/* <h2 className={cn(h2(), "border-none")}>
              Convenient daily scrum, in a more collaborative way
            </h2> */}

            <h2 className={cn(h2(), "font-bold")}>Free and open source</h2>

            <h3 className={cn(h3(), "mt-8")}>Enjoy all features for free</h3>
            <p className={cn(p(), "")}>
              Kiwiy Daily Scrum is entirely free to use. We believe in offering
              valuable tools without any cost.
            </p>

            <h3 className={cn(h3(), "mt-8")}>Open source for the community</h3>

            <p className={cn(p(), "")}>
              Kiwiy Daily Scrum is an open-source project built by and for the
              community. This means you can use it freely and benefit from
              continuous improvements.
            </p>
          </div>
        </section>

        {/* <div className="h-28 hidden sm:!block"></div> */}
        <div className="h-28"></div>

        <section className="py-10 max-w-2xl mx-auto ">
          <div className="text-left space-y-6">
            {/* <h2 className={cn(h2(), "font-bold")}> */}
            <h2 className={cn(h1(), " !text-[40px]")}>
              Ready to make your daily scrum seamless?
            </h2>

            <p className={cn(p(), "")}>
              Take the first step towards a smoother and more efficient daily
              scrum. <br /> Try Kiwiy Daily Scrum now and see how it can
              streamline your team{`'`}s daily scrum.
            </p>

            <Button size="lg" className="w-full md:!w-auto" asChild>
              <Link href="/app">Get Started</Link>
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
