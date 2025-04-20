import { HTMLMotionProps } from "framer-motion";

declare module "framer-motion" {
  // Add the 'className' property to all motion components
  export interface MotionProps {
    className?: string;
  }

  // Define the correct type for motion components
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
  }
}
