import type { CmsReview } from "../lib/cms-types";
import { googleReviewHighlights, googleReviewsUrl } from "../lib/site-data";
import { GoogleIcon } from "./site-icons";

type GoogleReviewsStripProps = {
  reviews?: CmsReview[];
};

export function GoogleReviewsStrip({ reviews = googleReviewHighlights }: GoogleReviewsStripProps) {
  return (
    <section className="google-review-strip reveal-item" aria-label="Google yorumları">
      <a className="google-review-lead" href={googleReviewsUrl} target="_blank" rel="noreferrer">
        <GoogleIcon />
        <span>
          <strong>Google yorumları</strong>
          <small>Profili aç</small>
        </span>
      </a>
      <div className="review-marquee">
        <div className="review-track">
          <div className="review-group">
            {reviews.map((review) => (
              <a
                className="review-pill"
                href={googleReviewsUrl}
                target="_blank"
                rel="noreferrer"
                key={review.text}
              >
                <span className="review-card-head">
                  <GoogleIcon />
                  <span className="review-source">{review.author}</span>
                  <span className="review-stars" aria-label="5 yıldız">
                    ★★★★★
                  </span>
                </span>
                <span className="review-text">{review.text}</span>
              </a>
            ))}
          </div>
          <div className="review-group" aria-hidden="true">
            {reviews.map((review) => (
              <span className="review-pill" key={`loop-${review.text}`}>
                <span className="review-card-head">
                  <GoogleIcon />
                  <span className="review-source">{review.author}</span>
                  <span className="review-stars">★★★★★</span>
                </span>
                <span className="review-text">{review.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
