"use client";

import { useSearchParams } from "next/navigation";
import Script from "next/script";
import React from "react";

type Props = {};

const AnalyticsScripts = (props: Props) => {
  const searchParams = useSearchParams();
  console.log({ searchParams });
  const noTrackingQuery = searchParams.get("no-tracking");
  const noTracking = noTrackingQuery
    ? decodeURIComponent(noTrackingQuery) === "true"
    : false;

  return (
    <>
      {process.env.NODE_ENV === "production" && !noTracking && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-ZXQWB7MHM7`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZXQWB7MHM7');
            `}
          </Script>
          <Script id="ms-clarity">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "n0wi3fv67g");
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default AnalyticsScripts;
