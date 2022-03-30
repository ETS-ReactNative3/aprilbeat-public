import type { AuthUser } from "@supabase/supabase-js";
import type { Users } from "@prisma/client";

export interface AppDataProps {
  pageTransitionAnimationControl: {
    mount: Function;
    unmount: Function;
  };
  inTransition: {
    state: boolean;
    stateSetter: Function;
  };
  audioLoaded: {
    state: boolean;
    stateSetter: Function;
  };
  user: {
    state: AuthUser | undefined;
    stateSetter: Function;
  };
  userData: {
    state: Users | undefined;
    stateSetter: Function;
  };
}
