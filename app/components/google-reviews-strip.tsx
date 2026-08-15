import type { CSSProperties } from "react";
import type { CmsReview } from "../lib/cms-types";
import { googleReviewsUrl } from "../lib/site-data";
import { GoogleIcon } from "./site-icons";

type GoogleReviewsStripProps = {
  reviews?: CmsReview[];
};

type ReviewStripStyle = CSSProperties & {
  "--review-marquee-duration": string;
};

const genericReviewAuthors = new Set(["Google kullanıcısı", "Google yorumu", "A Google User"]);

function isVisibleReview(review: CmsReview) {
  const author = review.author.trim();
  const text = review.text.trim();

  return author.length > 0 && text.length > 0 && !genericReviewAuthors.has(author);
}

function getReviewAuthor(review: CmsReview) {
  const author = review.author.trim();
  return author;
}

function getReviewRating(review: CmsReview) {
  return Math.max(1, Math.min(5, Math.round(review.rating ?? 5)));
}

export function GoogleReviewsStrip({ reviews = [] }: GoogleReviewsStripProps) {
  const visibleReviews = reviews.filter(isVisibleReview);
  const hasReviews = visibleReviews.length > 0;
  const reviewStripStyle: ReviewStripStyle = {
    "--review-marquee-duration": `${Math.max(42, visibleReviews.length * 12)}s`,
  };

  return (
    <section
      className={`google-review-strip reveal-item${hasReviews ? "" : " google-review-strip--empty"}`}
      aria-label="Google yorumları"
      style={reviewStripStyle}
    >
      <a className="google-review-lead" href={googleReviewsUrl} target="_blank" rel="noreferrer">
        <GoogleIcon />
        <span>
          <strong>Google yorumları</strong>
          <small>Profili aç</small>
        </span>
      </a>
      {hasReviews ? (
        <div className="review-marquee">
          <div className="review-track">
            <div className="review-group">
              {visibleReviews.map((review) => {
                const rating = getReviewRating(review);

                return (
                  <a
                    className="review-pill"
                    href={review.href ?? googleReviewsUrl}
                    target="_blank"
                    rel="noreferrer"
                    key={`${getReviewAuthor(review)}-${review.text}`}
                  >
                    <span className="review-card-head">
                      <GoogleIcon />
                      <span className="review-source">{getReviewAuthor(review)}</span>
                      <span className="review-stars" aria-label={`${rating} yıldız`}>
                        {"★★★★★".slice(0, rating)}
                      </span>
                    </span>
                    <span className="review-text">{review.text}</span>
                  </a>
                );
              })}
            </div>
            <div className="review-group" aria-hidden="true">
              {visibleReviews.map((review) => {
                const rating = getReviewRating(review);

                return (
                  <span className="review-pill" key={`loop-${getReviewAuthor(review)}-${review.text}`}>
                    <span className="review-card-head">
                      <GoogleIcon />
                      <span className="review-source">{getReviewAuthor(review)}</span>
                      <span className="review-stars">{"★★★★★".slice(0, rating)}</span>
                    </span>
                    <span className="review-text">{review.text}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
