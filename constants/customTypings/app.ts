import type { AuthUser, AuthSession } from "@supabase/supabase-js";

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
}
