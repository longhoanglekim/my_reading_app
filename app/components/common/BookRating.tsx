import { Star, StarHalf } from "lucide-react";

const BookRating = ({ rating }: { rating: number }) => {
  // Logic chọn màu theo khoảng điểm
  const getRatingColor = (val: number) => {
    if (val >= 4.5) return "text-emerald-500"; // Rất tốt - Xanh lá
    if (val >= 3.5) return "text-amber-500"; // Khá - Vàng cam
    if (val >= 2.5) return "text-orange-500"; // Trung bình - Cam
    return "text-red-500"; // Tệ - Đỏ
  };

  const colorClass = getRatingColor(rating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 whitespace-nowrap">
        <span className={`text-lg font-bold ${colorClass}`}>
          {rating.toFixed(1)}
        </span>

        <span className="text-lg text-gray-400">/5</span>
      </div>
    </div>
  );
};
export default BookRating;
