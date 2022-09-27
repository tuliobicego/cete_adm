declare module "*.png" {
  import { ReactElement, PNGProps } from "react";
  const content: (props: PNGProps<PNGElement>) => ReactElement;
  export default content;
}