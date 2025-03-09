import {redirect} from "next/navigation";

export default function Home() {
    redirect("/media-library");

  return (
      <div className="bg-redish">
        house
      </div>
  );
}