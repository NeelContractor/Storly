"use client"

import CurrentPath from "@/components/common/CurrentPath";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppDispatch } from "src/store/redux-toolkit/hooks";
import { filterSearchActions } from "src/store/redux-toolkit/filterSearch";
import ImageSearchBar from "../ProductCategory/ImageSearchBar";
import axios from "axios";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";
// import Filter from "../ProductCategory/MainContent/Filter/Filter";
import FilterStatus from "../ProductCategory/MainContent/Filter/Accordions/FilterStatus"
import ProductList from "../ProductCategory/MainContent/ProductList";
import { ProductDocument } from "src/model/Product";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgClose } from "react-icons/cg";
import PriceRange from "../ProductCategory/MainContent/Filter/PriceRange";
import Checkboxs from "../ProductCategory/MainContent/Filter/Checkboxs";

export interface Shop {
  _id?: string;
  shopName: string;
  ownerName: string;
  email: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const BACKEND_URL = "http://localhost:8080";

export default function StorlyHomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<ProductDocument[]>([]);

  // Fetch all products on mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getAllProducts();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error("Backend fetch error:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // Fetch products by shop whenever router.query.productCategory changes
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const shopName = router.query.productCategory as string;
        if (!shopName) return;
        const data = await getProductsByShop(shopName);
        setProducts(data);
      } catch (error) {
        console.error("Backend fetch error:", error);
      }
    };
    fetchShopProducts();
  }, [router.query.productCategory]);

  useEffect(() => {
    dispatch(filterSearchActions.resetQuery());
  }, [dispatch, router.query.productCategory]);

  return (
    <div className="layout-container pb-20 sm:px-4">
      <CurrentPath url1={`${router.query.productCategory ?? "Shop"}'s Store`} />
      <div className="flex xs:flex-col gap-3">
        <Title productsList={products} />
        <ImageSearchBar />
      </div>
      {products}
      <MainContent productsList={products} />
    </div>
  );
}

// API calls
const getAllProducts = async () => {
  const response = await axios.get<ApiResponse<ProductDocument[]>>(`${BACKEND_URL}/api/products`);
  return response.data.data;
};

const getProductsByShop = async (shopName: string) => {
  const response = await axios.get<ApiResponse<ProductDocument[]>>(`${BACKEND_URL}/api/products/shop/${shopName}`);
  return response.data.data;
};

// Title Component
interface TitleProps {
  productsList: ProductDocument[];
}

function Title({ productsList }: TitleProps) {
  const router = useRouter();
  const [btnPress, setBtnPress] = useState("");
  const shopName = router.query.productCategory as string;
  const formattedShopName = shopName ? shopName.replace(/-/g, " ") : "Shop";

  const sortAscendingHandler = () => {
    router.push(`/${shopName}${router.query.sort === "asc" ? "" : "?sort=asc"}`);
  };

  const sortDescendingHandler = () => {
    router.push(`/${shopName}${router.query.sort === "desc" ? "" : "?sort=desc"}`);
  };

  useEffect(() => {
    setBtnPress(router.query.sort === "asc" ? "btn1" : router.query.sort === "desc" ? "btn2" : "");
  }, [router.query.sort]);

  return (
    <div>
      <div
        className="mt-[30px] font-bold text-5xl mb-6 capitalize md:text-4xl md:mb-4 xs:mt-[15px] xs:mb-2 dark:text-white"
      >
        {formattedShopName}'s Store
      </div>
      <p className="text-slate-600 text-base mb-[30px] font-medium md:text-sm xs:text-xs dark:text-white">
        {`Showing ${productsList.length} products`}
      </p>
      <div className="text-right text-sm font-semibold uppercase relative md:text-xs sm:text-right xs:text-left dark:text-white">
        <p>sorted by:</p>
        <div className="absolute top-[-3px] right-[-90px] flex items-center gap-2 md:right-[-50px] sm:right-[-80px] xs:right-[180px]">
          <button
            onClick={sortAscendingHandler}
            className={`flex-center py-1 px-2 bg-white text-black transition duration-300 ${
              btnPress === "btn1" && "!bg-primary-color"
            }`}
          >
            <FaSortAmountDownAlt className="text-lg md:text-sm" />
          </button>
          <button
            onClick={sortDescendingHandler}
            className={`flex-center py-1 px-2 bg-white text-black transition duration-300 ${
              btnPress === "btn2" && "!bg-primary-color"
            }`}
          >
            <FaSortAmountDown className="text-lg md:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

// MainContent Component
interface MainContentProps {
  productsList: ProductDocument[];
}

function MainContent({ productsList }: MainContentProps) {
  return (
    <div className="grid grid-cols-product-category gap-x-4 items-start lg:grid-cols-[180px_1fr] sm:grid-cols-1">
      <Filter productsList={productsList} />
      <ProductList productsList={productsList} />
    </div>
  );
}

// Filter Component
interface FilterProps {
  productsList: ProductDocument[];
}

function Filter({ productsList }: FilterProps) {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({});
  const [isMobile, setIsMobile] = useState(false);

  const toggleFilter = () => setIsShowFilter(prev => !prev);

  useEffect(() => {
    const handleSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleSize);
    handleSize();
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  useEffect(() => {
    setIsMobile((windowSize.width ?? 0) < 630);
  }, [windowSize.width]);

  return (
    <>
      {isMobile && !isShowFilter && <GiHamburgerMenu className="text-2xl z-20" onClick={toggleFilter} />}
      {isMobile && isShowFilter && <CgClose className="text-2xl z-20" onClick={toggleFilter} />}
      <div className={`sm:absolute sm:top-0 sm:left-[-200px] ${isShowFilter && "sm:top-[420px] sm:left-0 sm:z-10 shadow-lg bg-white text-sm w-[230px]"}`}>
        <PriceRange />
        <FilterStatus />
        <Checkboxs productsList={productsList} />
      </div>
    </>
  );
}