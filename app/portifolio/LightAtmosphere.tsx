import { MovingContours } from "./ContourBackground";
import styles from "./below.module.css";

export function LightAtmosphere() {
  return (
    <div className={styles.lightAtmosphere} aria-hidden="true">
      <MovingContours tone="light" />
    </div>
  );
}
