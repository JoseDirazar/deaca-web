import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 20 
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`${!readonly ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
        >
          {star <= rating ? (
            <FaStar size={size} className="text-yellow-400" />
          ) : (
            <FaRegStar size={size} className="text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}
