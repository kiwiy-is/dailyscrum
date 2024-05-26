import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <h1>ENV TEST</h1>
      <ul>
        <li>{process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
        <li>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}</li>
        <li>{process.env.SUPABASE_SERVICE_ROLE_KEY}</li>
        <li>{process.env.ASSET_PREFIX}</li>
      </ul>
    </div>
  );
};

export default Page;
