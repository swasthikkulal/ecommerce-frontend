import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function SingleViewPage() {
  const [getbyId, setgetbyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchIcecream = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/product/${id}`)
      .then((res) => {
        setgetbyId(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIcecream();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (!getbyId)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Product not found
      </div>
    );

  return (
    <div className="max-w-[100%] min-h-screen grid justify-center items-center">
      <div className="md:grid md:grid-cols-2 max-w-[100%] items-center justify-center">
        <div className="md:max-w-[100%] w-[100%] grid items-center justify-center">
          <div className="px-[20%] pt-[15%] mb-[2%]">
            <p className="flex">
              Frutify /{" "}
              <b className="text-red-500 font-semibold">{getbyId.name}</b>
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={getbyId.image}
              alt={getbyId.name}
              className="imageShadow max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="md:max-w-[100%] w-[87%] grid items-center justify-center">
          <div className="mt-[5%] grid items-center justify-center md:mx-0 mx-3">
            <div className="bg-green-600 md:w-[98%] w-[116%] p-5 rounded-t-4xl">
              <p className="md:text-4xl text-2xl font-semibold">
                {getbyId.name}
              </p>
              <div className="flex gap-[0.5rem] md:mt-[2rem] mt-[1rem]">
                <div className="w-5 border-2 border-emerald-900 h-5 rounded-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-900"></div>
                </div>
                <p>Ice-Cream</p>
              </div>
              <div className="flex items-center gap-[0.5rem] mt-[0.5rem]">
                <p className="md:text-2xl text-xl">
                  Price: {getbyId.price} per 1/kg
                </p>
                <div className="md:w-[5rem] w-[4rem] h-[1.5rem] border-2 border-blue-700 flex items-center justify-center rounded-sm">
                  <p className="text-blue-700 font-semibold text-sm">20% off</p>
                </div>
              </div>
              <div className="w-[8rem] h-[2.5rem] bg-orange-300 rounded-full flex items-center justify-center text-sm mt-[0.5rem] gap-1 cursor-pointer hover:bg-orange-400 transition-colors">
                <p className="font-semibold">ADD</p>
                <p className="mt-[-1rem] font-semibold">+</p>
              </div>
              <div className="md:mx-[3.5%] mx-[10%]">
                <p className="text-[0.7rem]">Customisable</p>
              </div>
            </div>
            <div className="border border-black/5 bg-neutral-800/5 md:w-[98%] w-[116%] p-5">
              <div className="md:mt-[2rem] mt-[1rem]">
                <p className="md:text-2xl text-xl">Details of Icecream</p>
                <p className="md:text-[1rem] text-[0.8rem]">
                  {getbyId.description}
                </p>
              </div>
              <div className="md:mt-[2rem] mt-[1rem]">
                <p className="md:text-2xl text-xl">Stock</p>
                <p className="md:text-[1rem] text-[0.8rem] text-red-600">
                  {getbyId.stock} left - hurry!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You can add related products section here if needed */}
      <div className="mx-w-[100%] flex items-center justify-center mt-10">
        <div className="max-w-[95%]">
          <h2 className="text-2xl font-semibold mb-5">Related Products</h2>
          {/* Add related products grid here */}
        </div>
      </div>
    </div>
  );
}
