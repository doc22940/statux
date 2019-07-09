import Store, { useStore, useSelector } from "../index.js";

import "babel-polyfill";
import React from "react";
import $ from "./react-query";
import delay from "delay";

// The HTML list; we're not testing this, just a helper
const DisplayList = ({ items, onClick }) => (
  <ul onClick={onClick}>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

describe("List", () => {
  // We define and test a items:
  const List = () => {
    const [items, setItems] = useStore("items");
    const onClick = async e => setItems([...items, items.length]);
    return <DisplayList items={items} onClick={onClick} />;
  };

  it("should have a items", () => {
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.attr("items")).toEqual([]);
  });

  it("should increment items", async () => {
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.html()).toBe(`<ul></ul>`);
    await $list.click();
    expect($list.html()).toBe(`<ul><li>0</li></ul>`);
  });

  it("should double increment items", async () => {
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.html()).toBe(`<ul></ul>`);
    await $list.click();
    await $list.click();
    await $list.click();
    expect($list.html()).toBe(`<ul><li>0</li><li>1</li><li>2</li></ul>`);
  });

  it("can use prebuilt append", async () => {
    // We define and test a items:
    const List = () => {
      const [items, setItems] = useStore("items");
      const onClick = async e => setItems.append(items.length);
      return <DisplayList items={items} onClick={onClick} />;
    };
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.html()).toBe(`<ul></ul>`);
    await $list.click();
    await $list.click();
    await $list.click();
    expect($list.html()).toBe(`<ul><li>0</li><li>1</li><li>2</li></ul>`);
  });

  it("can use prebuilt prepend", async () => {
    // We define and test a items:
    const List = () => {
      const [items, setItems] = useStore("items");
      const onClick = async e => setItems.prepend(items.length);
      return <DisplayList items={items} onClick={onClick} />;
    };
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.html()).toBe(`<ul></ul>`);
    await $list.click();
    await $list.click();
    await $list.click();
    expect($list.html()).toBe(`<ul><li>2</li><li>1</li><li>0</li></ul>`);
  });

  it("can use prebuilt prepend with function", async () => {
    // We define and test a items:
    const List = () => {
      const [items, setItems] = useStore("items");
      const onClick = e => setItems.prepend(items => items.length);
      return <DisplayList items={items} onClick={onClick} />;
    };
    const $list = $(<Store items={[]} children={<List />} />);
    expect($list.html()).toBe(`<ul></ul>`);
    await $list.click();
    await $list.click();
    await $list.click();
    expect($list.html()).toBe(`<ul><li>2</li><li>1</li><li>0</li></ul>`);
  });

  it("can modify an item with the dot notation", async () => {
    // We define and test a items:
    const List = () => {
      const items = useSelector("items");
      const [item, setItem] = useStore("items.0");
      const onClick = e => setItem(3);
      return <DisplayList items={items} onClick={onClick} />;
    };
    const $list = $(<Store items={[0, 1, 2]} children={<List />} />);
    expect($list.html()).toBe(`<ul><li>0</li><li>1</li><li>2</li></ul>`);
    await $list.click();
    expect($list.html()).toBe(`<ul><li>3</li><li>1</li><li>2</li></ul>`);
  });
});
