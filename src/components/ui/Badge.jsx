import React from "react";
import { capitalise } from "../../utils/helpers";

/**
 * Displays a coloured status pill.
 * status: "paid" | "pending" | "draft"
 */
export default function Badge({ status }) {
  return (
    <div className={`badge badge--${status}`} aria-label={`Status: ${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {capitalise(status)}
    </div>
  );
}