"use client";
import {
  Product,
  ProductBrands,
  ProductDisplays,
  ProductOS,
  ProductProcessors,
} from "@/types/product";
import { useState } from "react";
import Link from "next/link";
import {
  productRegisterSchema,
  productUpdateSchema,
} from "@/schemas/productsSchemas";
import Image from "next/image";
import { createProduct, updateProductById } from "@/services/products";
import { useAlerts } from "@/context/altersContext";
import { uploadImage } from "@/services/images";

interface Props {
  product?: Product; // opcional
  productDisplays: ProductDisplays[];
  productOS: ProductOS[];
  productProcessors: ProductProcessors[];
  productBrands: ProductBrands[];
}

export default function EditProductForm({
  product,
  productBrands,
  productDisplays,
  productOS,
  productProcessors,
}: Props) {
  const { addAlert } = useAlerts();
  //pantallas
  const displayOptions = {
    sizes: Array.from(new Set(productDisplays.map((d) => d.size))),
    resolutions: Array.from(new Set(productDisplays.map((d) => d.resolution))),
    graphics: Array.from(new Set(productDisplays.map((d) => d.graphics))),
    brands: Array.from(
      new Set(productDisplays.map((d) => d.brand).filter(Boolean))
    ),
  };

  const processorBrands = Array.from(
    new Set(productProcessors.map((d) => d.brand))
  );

  //estados para selects condicionales (si hay producto, usa sus datos, si no, valores por defecto)
  const [selectedBrand, setSelectedBrand] = useState(
    product?.processor.brand || ""
  );
  const [selectedFamily, setSelectedFamily] = useState(
    product?.processor.family || ""
  );
  const [selectedModel, setSelectedModel] = useState(
    product?.processor.model || ""
  );

  // sistema operativo
  const [selectedOS, setSelectedOS] = useState(product?.system.system || "");
  const [selectedDistribution, setSelectedDistribution] = useState(
    product?.system.distribution || ""
  );
  const osOptions = Array.from(new Set(productOS.map((d) => d.system)));

  // Estados para la pantalla
  const [selectedDisplayBrand, setSelectedDisplayBrand] = useState(
    product?.display.brand || ""
  );
  const [selectedDisplayGraphics, setSelectedDisplayGraphics] = useState(
    product?.display.graphics || ""
  );
  const [selectedDisplaySize, setSelectedDisplaySize] = useState<number | "">(
    product?.display.size || ""
  );
  const [selectedDisplayResolution, setSelectedDisplayResolution] = useState(
    product?.display.resolution || ""
  );

  // Filtrados condicionales
  const filteredGraphics = Array.from(
    new Set(
      productDisplays
        .filter((d) => d.brand === selectedDisplayBrand)
        .map((d) => d.graphics)
    )
  );

  const filteredSizes = Array.from(
    new Set(
      productDisplays
        .filter(
          (d) =>
            d.brand === selectedDisplayBrand &&
            d.graphics === selectedDisplayGraphics
        )
        .map((d) => d.size)
    )
  );

  const filteredResolutions = Array.from(
    new Set(
      productDisplays
        .filter(
          (d) =>
            d.brand === selectedDisplayBrand &&
            d.graphics === selectedDisplayGraphics &&
            d.size === selectedDisplaySize
        )
        .map((d) => d.resolution)
    )
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //obtener datos del formulario
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string | null,
      model: formData.get("model") as string | null,
      brand: formData.get("brand") as string | null,
      price: Number(formData.get("price")),
      discount: Number(formData.get("discount")),
      ram_capacity: Number(formData.get("ram_capacity")),
      disk_capacity: Number(formData.get("disk_capacity")),
      description: formData.get("description") as string | null,
      stock: Number(formData.get("stock")),
      display: {
        size: Number.parseFloat(
          formData.get("display.size")?.toString() || "0"
        ),
        resolution: formData.get("display.resolution") as string | null,
        brand: formData.get("display.brand") as string | null,
        graphics: formData.get("display.graphics") as string | null,
      },

      processor: {
        brand: formData.get("processor.brand") as string | null,
        family: formData.get("processor.family") as string | null,
        model: formData.get("processor.model") as string | null,
        cores: 0,
        speed: "",
      },

      system: {
        system: formData.get("os.system") as string | null,
        distribution: formData.get("os.dis") as string | null,
      },
    };
    const getProcessor: ProductProcessors | undefined = productProcessors.find(
      (e) =>
        e.model == data.processor.model &&
        e.brand == data.processor.brand &&
        e.family == data.processor.family
    );
    if (!getProcessor)
      return addAlert("Error con el procesador seleccionado", "error");
    //si producto existe se actualiza
    if (product) {
      //actualizar producto
      //obtener ids
      const processor_id = getProcessor.id;
      const system_id =
        productOS.find(
          (p) =>
            p.distribution == data.system.distribution &&
            p.system == data.system.system
        )?.id ?? 0;
      const display_id =
        productDisplays.find(
          (p) =>
            p.graphics == data.display.graphics &&
            p.resolution == data.display.resolution &&
            p.brand == data.display.brand &&
            p.size === data.display.size
        )?.id ?? 0;
      const brand_id =
        productBrands.find((p) => p.name === data.brand)?.id ?? 0;
      //formatear objeto a updateProduct
      const t = {
        ...data,
        processor_id,
        system_id,
        display_id,
        brand_id,
      };
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        processor: _p,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        display: _o,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        system: _t,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        brand: _i,
        ...updateProduct
      } = t;
      //validar
      const validation = productUpdateSchema.safeParse(updateProduct);
      if (!validation.success) {
        console.warn(validation.error);
        return addAlert("Error al actualizar el producto.", "error");
      }

      //enviar al servidor
      const res = await updateProductById(product.id, validation.data);
      //alertas
      if (res === 200) return addAlert("Producto actualizado", "success");
      return addAlert("Producto no actualizado", "warning");
    } else {
      //crear producto
      //subir imagen
      const file = formData.get("file") as File | null;

      if (file) {
        //Validar tamaño
        const maxSize = 30 * 1024; //30KB
        if (file.size > maxSize) {
          console.error("El archivo excede los 30KB");
          return;
        }

        //Renombrar archivo
        const originalName = file.name.split(".")[0];
        const safeName = originalName.replace(/\s+/g, "-");
        const newFileName = `${safeName}.webp`;

        //File con el nombre modificado
        const renamedFile = new File([file], newFileName, {
          type: "image/webp",
        });

        //Subir al servidor
        const ImagePath = await uploadImage({ file: renamedFile });
        if (ImagePath) {
          //obtener nombre de la imagen
          const imageName = ImagePath.split("/").pop();
          //agregar datos del procesador
          data.processor.cores = getProcessor.cores;
          data.processor.speed = getProcessor.speed;
          //validar
          const validation = productRegisterSchema.safeParse({
            ...data,
            image: imageName,
          });
          if (!validation.success) {
            console.log(validation.error);
            return addAlert("Datos inválidos", "warning");
          }
          //registrar
          console.log(validation.data);
          const res = await createProduct(validation.data);
          console.log(res);
          if (res === 201) return addAlert("Producto creado", "success");
          return addAlert("Producto no creado", "warning");
        } else {
          console.log("Error al subir la imagen");
        }
      } else {
        console.log("No se seleccionó ningún archivo");
      }
    }
  };

  //estilos base inputs
  const baseInput =
    "border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition";
  //si es apple
  const isApple = product?.processor.brand.includes("Apple");
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white ">
        <div
          className={`${
            product
              ? "grid grid-cols-1 md:grid-cols-3 grid-rows-3"
              : "grid grid-cols-2 gap-4"
          }`}
        >
          {product ? (
            <div className="row-span-3">
              <p className="font-medium mb-1">Imagen</p>
              <div className="overflow-hidden ">
                <Image
                  src={product.image}
                  alt={product.name + " " + product.model}
                  width={300}
                  height={300}
                  className="object-contain scale-105 "
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="file" className="block font-medium mb-1">
                Imagen
              </label>
              <input
                type="file"
                name="file"
                id="file"
                accept=".webp"
                required
                className={baseInput}
              />
            </div>
          )}
          {/* Nombre */}
          <div className={product && "col-span-2"}>
            <label htmlFor="name" className="block font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              minLength={5}
              maxLength={40}
              defaultValue={product?.name || ""}
              className={baseInput}
            />
          </div>

          {/* Marca */}
          <div className={product && "col-span-2"}>
            <label htmlFor="brand" className="block font-medium mb-1">
              Marca
            </label>
            <select
              name="brand"
              id="brand"
              className={baseInput}
              defaultValue={product?.brand || ""}
            >
              <option value="">Selecciona marca</option>
              {productBrands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          {/* Modelo */}
          <div className={product && "col-span-2"}>
            <label htmlFor="model" className="block font-medium mb-1">
              Modelo
            </label>
            <input
              type="text"
              name="model"
              id="model"
              minLength={5}
              maxLength={36}
              defaultValue={product?.model || ""}
              className={baseInput}
            />
          </div>
        </div>

        {/* Precio y Descuento */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Precio
            </label>
            <input
              type="number"
              name="price"
              id="price"
              min={100000}
              max={20000000}
              defaultValue={product?.price || ""}
              className={baseInput}
            />
          </div>
          <div>
            <label htmlFor="discount" className="block font-medium mb-1">
              Descuento
            </label>
            <input
              type="number"
              name="discount"
              id="discount"
              min={0}
              max={90}
              defaultValue={product?.discount || ""}
              className={baseInput}
            />
          </div>
          <div>
            <label htmlFor="stock" className="block font-medium mb-1">
              Unidades disponibles
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              min={0}
              defaultValue={product?.stock || ""}
              className={baseInput}
            />
          </div>
        </div>

        {/* RAM y Disco */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ram_capacity" className="block font-medium mb-1">
              RAM (GB)
            </label>
            <input
              type="number"
              name="ram_capacity"
              id="ram_capacity"
              min={8}
              max={128}
              defaultValue={product?.ram_capacity || ""}
              className={baseInput}
            />
          </div>
          <div>
            <label htmlFor="disk_capacity" className="block font-medium mb-1">
              Disco (GB)
            </label>
            <input
              type="number"
              name="disk_capacity"
              id="disk_capacity"
              min={120}
              max={10000}
              defaultValue={product?.disk_capacity || ""}
              className={baseInput}
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            minLength={10}
            maxLength={1000}
            defaultValue={product?.description || ""}
            className={`${baseInput} h-24`}
          />
        </div>

        {/* Pantalla */}
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold">Pantalla</legend>
          <div className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <select
              name="display.brand"
              className={baseInput}
              value={selectedDisplayBrand}
              onChange={(e) => {
                setSelectedDisplayBrand(e.target.value);
                setSelectedDisplayGraphics("");
                setSelectedDisplaySize("");
                setSelectedDisplayResolution("");
              }}
              disabled={isApple}
            >
              <option value="">Selecciona marca</option>
              {displayOptions.brands.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>

            {/* Gráficos */}
            <select
              name="display.graphics"
              className={baseInput}
              value={selectedDisplayGraphics}
              onChange={(e) => {
                setSelectedDisplayGraphics(e.target.value);
                setSelectedDisplaySize("");
                setSelectedDisplayResolution("");
              }}
              disabled={!selectedDisplayBrand}
            >
              <option value="">Selecciona gráficos</option>
              {filteredGraphics.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>

            {/* Tamaño */}
            <select
              name="display.size"
              className={baseInput}
              value={selectedDisplaySize}
              onChange={(e) => {
                setSelectedDisplaySize(parseFloat(e.target.value));
                setSelectedDisplayResolution("");
              }}
              disabled={!selectedDisplayGraphics}
            >
              <option value="">Selecciona tamaño</option>
              {filteredSizes.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>

            {/* Resolución */}
            <select
              name="display.resolution"
              className={baseInput}
              value={selectedDisplayResolution}
              onChange={(e) => setSelectedDisplayResolution(e.target.value)}
              disabled={!selectedDisplaySize}
            >
              <option value="">Selecciona resolución</option>
              {filteredResolutions.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Procesador */}
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold">Procesador</legend>
          <div className="grid grid-cols-3 gap-4">
            {/* Marca */}
            <select
              name="processor.brand"
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedFamily("");
                setSelectedModel("");
              }}
              className={baseInput}
            >
              <option value="">Selecciona marca</option>
              {processorBrands.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Familia */}
            <select
              name="processor.family"
              value={selectedFamily}
              onChange={(e) => {
                setSelectedFamily(e.target.value);
                setSelectedModel("");
              }}
              className={baseInput}
              disabled={!selectedBrand}
            >
              <option value="">Selecciona familia</option>
              {Array.from(
                new Set(
                  productProcessors
                    .filter((p) => p.brand === selectedBrand)
                    .map((p) => p.family)
                )
              ).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* Modelo */}
            <select
              name="processor.model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={baseInput}
              disabled={!selectedFamily}
            >
              <option value="">Selecciona modelo</option>
              {productProcessors
                .filter(
                  (p) =>
                    p.brand === selectedBrand && p.family === selectedFamily
                )
                .map((p) => (
                  <option key={p.model} value={p.model}>
                    {p.model}
                  </option>
                ))}
            </select>
          </div>
        </fieldset>

        {/* Sistema operativo */}
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold">Sistema Operativo</legend>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="os.system"
              value={selectedOS}
              onChange={(e) => {
                setSelectedOS(e.target.value);
                setSelectedDistribution("");
              }}
              className={baseInput}
            >
              <option value="">Selecciona sistema</option>
              {osOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <select
              name="os.dis"
              className={baseInput}
              disabled={!selectedOS}
              defaultValue={selectedDistribution}
            >
              <option value="">Selecciona distribución</option>
              {productOS
                .filter((p) => p.system === selectedOS)
                .map((d) => (
                  <option key={d.id} value={d.distribution}>
                    {d.distribution}
                  </option>
                ))}
            </select>
          </div>
        </fieldset>

        {/* Botón */}
        <div className="flex justify-between">
          <Link
            href="/admin/products"
            className="bg-blue text-white p-2 rounded-md hover:bg-dark-blue transition font-bold duration-300 hover:scale-105 ease-in-out inline-block"
          >
            Volver
          </Link>
          <button
            type="submit"
            className="bg-green text-white p-2 rounded-md hover:bg-dark-green transition font-bold duration-300 hover:scale-105 ease-in-out"
          >
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </>
  );
}
