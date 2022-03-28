interface AppDataProps {
  pageTransitionAnimationControl: {
    mount: Function<Promise<Boolean>>;
    unmount: Function<Promise<Boolean>>;
  };
  inTransition: Array;
  audioLoaded: Array;
}
