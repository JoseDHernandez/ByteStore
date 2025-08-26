export default function Loading() {
  return (
    <section>
      <div className="flex gap-4">
        {/* Skeleton del filtro lateral */}
        <div className="animate-pulse">
          <div className="w-15 h-10 bg-gray-300 rounded-md md:hidden"></div>
          <div className="p-4 bg-white border-1 border-gray shadow-xl rounded-2xl h-max  max-w-[20rem]  w-[27dvw] hidden md:block">
            <div className="flex gap-5 items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 "></div>
              <div className="bg-gray-200 h-10 w-full"></div>
            </div>
            <div className="bg-gray-200 h-[70dvh]"></div>
            <div className="flex gap-4  xl:flex-wrap mt-4">
              <div className="bg-gray-200 w-10 h-10 "></div>
              <div className="bg-gray-200 w-30 h-10"></div>
            </div>
          </div>
        </div>

        {/* Skeleton de la grilla de productos */}
        <div className="lg:col-span-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-4 gap-4 w-full">
          {[...Array(11)].map((_, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-300 shadow rounded-2xl p-4 animate-pulse 
                ${
                  index === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : index === 1 || index === 2
                    ? "lg:col-span-2"
                    : ""
                }`}
            >
              <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto" />
              <div
                className={`${
                  (index === 1 || index === 2) && "flex gap-4 flex-row-reverse"
                }`}
              >
                <div className="flex justify-center items-center">
                  <div className="bg-gray-200 rounded w-[200px] h-[200px]" />
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton del paginador */}
      <div className="mt-6 flex justify-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
