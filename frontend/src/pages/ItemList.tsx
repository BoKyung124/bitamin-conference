import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import PageDesc from "../components/PageDesc";
import Navigation from "../components/Navigation/Navigation";
import { HomeContainer, NavContainer } from "./Home";
import propMatcher, { propMatcherProps } from "../etc/propMatcher";
import { ItemProps } from "../components/Category/FourGrid";

import FourGridContainer from "../components/Category/FourGrid";
import OneGrid from "../components/Category/OneGrid";
import NineGridContainer from "../components/Category/NineGrid";
import styled from "styled-components";

const CategoryContainer = styled(HomeContainer)`
  gap: 3%;
`;

const ItemList = () => {
  const { id = "" } = useParams();
  const [oneData, setOneData] = useState<ItemProps[]>([]);
  const [fourData, setFourData] = useState<ItemProps[]>([]);
  const [nineData, setNineData] = useState<ItemProps[]>([]);

  const requestCategoryData = () => {
    axios.get(`http://0.0.0.0:8000/product-data/${id}`).then((response) => {
      const pattern = /{(.*?)}/g;
      setFourData(
        response.data
          .slice(1, -1)
          .match(pattern)
          .map((item: string) => JSON.parse(item))
          .slice(0, 4)
      );
      setOneData(
        response.data
          .slice(1, -1)
          .match(pattern)
          .map((item: string) => JSON.parse(item))
          .slice(4, 5)
      );
      setNineData(
        response.data
          .slice(1, -1)
          .match(pattern)
          .map((item: string) => JSON.parse(item))
          .slice(-6)
      );
    });
  };

  useEffect(() => {
    requestCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Header />
      <PageDesc category={propMatcher[id as keyof propMatcherProps]} />
      <CategoryContainer>
        <FourGridContainer propWhichIsArray={fourData} />
        {oneData.map((item) => (
          <OneGrid
            key={item.product_num}
            product_num={item.product_num}
            product_name={item.product_name}
            price={item.price}
          />
        ))}
        <NineGridContainer propWhichIsArray={nineData} />
      </CategoryContainer>
      <NavContainer>
        <Navigation />
      </NavContainer>
    </>
  );
};

export default ItemList;
