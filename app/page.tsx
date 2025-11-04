// import Image from "next/image";

import { Button } from "@/components/ui/button";
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// import DashboardIndexPage from "./dashboard/page";

export default async function Home() {

  const {getUser} = getKindeServerSession();
  const session = await getUser();
  return (
    <div className="p-10">
      <h1>Welcome to Our App</h1>

      {session ? (
        <LogoutLink><Button>Sign out</Button></LogoutLink>
      ) : (

        <div>
          <LoginLink><Button>Sign in</Button></LoginLink>
          <RegisterLink><Button>Sign up</Button></RegisterLink>
        </div>

      )}
    </div>
      
  );
}
