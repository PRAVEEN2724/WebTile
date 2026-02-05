// src/components/TileCard.jsx
import { Link } from "react-router-dom";

export default function TileCard({ tile }) {
  // Handle image path consistently with backend
  const imagePath = tile.imagePath?.startsWith("/uploads/")
    ? `http://localhost:8080${tile.imagePath}`
    : `http://localhost:8080/uploads/${tile.imagePath}`;

  return (
    <Link to={`/tile/${tile.id}`}>
      <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
        <img
          src={imagePath}
          alt={tile.name}
          className="w-full h-40 object-cover rounded-lg"
        />
        <h2 className="mt-2 font-semibold">{tile.name}</h2>
        <p className="text-green-600 font-bold">₹{tile.price}</p>
      </div>
    </Link>
  );
}






/*import { Link } from 'react-router-dom';

function TileCard({ tile }) {
  const imagePath = tile.imagePath?.startsWith('/uploads/')
    ? `http://localhost:8080${tile.imagePath}`
    : `http://localhost:8080/uploads/${tile.imagePath}`;

  return (
    <Link to={`/tile/${tile.id}`} className="border rounded shadow hover:shadow-lg transition p-2">
      <img src={imagePath} alt={tile.name} className="h-40 w-full object-cover" />
      <h3 className="text-lg font-semibold mt-2">{tile.name}</h3>
      <p className="text-gray-600">₹{tile.price}</p>
    </Link>
  );
}

export default TileCard;*/
