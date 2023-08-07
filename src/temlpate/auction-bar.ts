import { sleep, keyboard, Key, mouse, screen, loadImage, Region, straightTo, Button } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { 아이템창_열기 } from "./inventory";
import { getImage, hasImage } from "../modules/hasImage";
import { moveClick } from "../modules/moveClick";
import { logger } from "../modules/logger";
import { 경매 } from "../constants";
import { getText } from "../modules/ocr";
import { koreanToNumber } from "../modules/koreanToNumber";
import { backspaceTyping, randomTypeKeyboard } from "../modules/keyboardClick";
import { emptyStringReplace } from "../modules/text";
import { getRandomPosition } from "../modules/vkey2";

const myAuctionItems = [
// {
//   name: '금봉',
//   engName: 'rmaqhd',
//   currentPrice: 19889,
//   count: 7,
//   maxRegisterCount: 7,
//   minimumPrice: 15000,
//   salesCount: 0,
//   shouldCancelRegistration: false,
//   threshold: 0.15,
// }, {
//   name: '은봉',
//   engName: 'dmsqhd',
//   currentPrice: 15999,
//   count: 7,
//   maxRegisterCount: 7,
//   minimumPrice: 14200,
//   salesCount: 0,
//   shouldCancelRegistration: false,
//   threshold: 0.15,
// },
// {
//   name: '철봉',
//   engName: 'cjfqhd',
//   currentPrice: 0,
//   count: 0,
//   maxRegisterCount: 5,
//   salesCount: 0,
//   minimumPrice: 10000,
//   shouldCancelRegistration: false,
//   threshold: 0.2,
// },
{
  name: '미스릴봉',
  engName: 'altmflfqhd',
  currentPrice: 29997,
  count: 0,
  maxRegisterCount: 21,
  salesCount: 0,
  minimumPrice: 25000,
  shouldCancelRegistration: false,
  threshold: 0.15,
}].sort((a, b) => a.name.localeCompare(b.name));

function getIconRegionWithXIcon(region: Region) {
  return new Region(region.left - 318, region.top - 7, region.width + 16, region.height + 16);
}

async function 아이템을_등록에_가져다놓기() {
  const region = await screen.find(
    loadImage(`${경매.filePath}/아이템존재여부.png`),
    { searchRegion: 경매.아이템_리스트 },
  );

  const itemRegion = getIconRegionWithXIcon(region);

  await keyboard.pressKey(Key.LeftAlt);
  await moveClick(itemRegion);
  await keyboard.releaseKey(Key.LeftAlt);
}

function getMinimumPriceRegion(index: number) {
  const price = new Region(890, 424 + (index * 30), 88, 30);
  const count = new Region(1030, 429 + (index * 30), 40, 20);

  return {
    price,
    count,
  } as const
}

function parseCountText(text: string) {
  const match = text.match(/(\d+)(개)/);

  if (match == null || match[1] == null) {
    return null;
  }

  return parseInt(match[1], 10);
}

type Price = { count: number, price: number };
async function getPriceList() {
  const priceList: { count: string; price: string }[] = [];

  for (let index = 0; index < 10; index++) {
    const { count, price } = getMinimumPriceRegion(index);
    const [countText, priceText] = await Promise.all([getText(count, 7), getText(price, 7)]);

    priceList.push({ count: countText, price: priceText });
  }

  const finalPriceList: Price[] = [];

  for (let index = 0; index < priceList.length; index++) {
    const count = parseCountText(priceList[index].count);
    const price = koreanToNumber(priceList[index].price);

    if (count == null || Number.isNaN(price)) {
      continue;
    }

    finalPriceList.push({ count, price: price === 29000 ? 28000 : price })
  }


  const filteredArray = finalPriceList
    .filter(x => x.price <= 100000)
    .filter((current, index, array) => {
      const prev = array[index - 1];
      const next = array[index + 1];

      if (index === 0 || index === array.length - 1) return true;

      return current.price > prev.price && current.price < next.price;
    });


  return filteredArray;
}

function getPriceDifferenceWithinThreshold(list: Price[], threshold = 0.10, skipCount = 0) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i].count < skipCount) {
      continue;
    }

    const currentPrice = list[i].price;
    const nextPrice = list[i + 1].price;
    const difference = Math.abs(currentPrice - nextPrice);

    if (difference <= currentPrice * threshold) {
      return currentPrice;
    }
  }

  return list[0]?.price ?? null;
}

type AuctionItems = typeof myAuctionItems;


async function updatePrices(auctionItems: AuctionItems) {
  for await (const [index, item] of auctionItems.entries()) {
    await moveClick(경매.검색어를_입력하세요);
    await backspaceTyping(5);

    await randomTypeKeyboard(item.engName);

    await moveClick(경매.아이템_등록);
    await sleep(350);

    await 아이템을_등록에_가져다놓기();
    await sleep(350);

    await moveClick(경매.등록최저가_리스트_버튼);
    await sleep(1200);

    await hasImage(`${경매.filePath}/시세표떳다.png`, 5000, { searchRegion: 경매.경매현황_화면 });

    const priceList = await getPriceList();
    const currentPrice = getPriceDifferenceWithinThreshold(
      priceList
        .filter(x => x.price > item.minimumPrice)
        .filter(x => x.count > 1),
      item.threshold
    );

    if (currentPrice != null) {
      if (item.currentPrice > currentPrice - 2000) {
        logger(`${item.name} 물건에 1빼기 들어왔어요 => ${item.currentPrice} => ${currentPrice - 100}`);
        auctionItems[index].currentPrice = currentPrice - 1;
        auctionItems[index].shouldCancelRegistration = true;
      } else if (item.currentPrice < currentPrice) {
        logger(`${item.name} 물건 가격이 상승해요! => ${item.currentPrice} => ${currentPrice - 100}`);
  
        if (item.currentPrice < currentPrice + 1000) {
          auctionItems[index].currentPrice = currentPrice - 1;
          auctionItems[index].shouldCancelRegistration = true;
        } else {
          logger(`${item.name} 물건 가격 차이가 1천골드 이하라 가격을 수정하지 않을게요.`);
        }
      }
    }



    await moveClick(경매.등록최저가_리스트_닫기버튼);
    await sleep(350);

    await moveClick(경매.아이템_등록_닫기버튼);
    await sleep(350);
  }

  return auctionItems;
}

async function registerItems(auctionItems: AuctionItems) {
  for await (let [index, item] of auctionItems.entries()) {
    if (item.count >= item.maxRegisterCount) {
      continue;
    }

    // await moveClick(경매.검색어를_입력하세요);
    // await backspaceTyping();
    // await randomTypeKeyboard(item.engName);

    let typed = false
    for (let i = item.count; i < item.maxRegisterCount; i++) {
      await moveClick(경매.아이템_등록);
      await sleep(350);

      await 아이템을_등록에_가져다놓기();
      await sleep(350);

      if (!typed) {
        typed = true;
        await moveClick(경매.현재가격);
        await sleep(350);
        await backspaceTyping();
        await randomTypeKeyboard(item.currentPrice.toString());
      }

      await moveClick(경매.아이템_등록_등록버튼);
      await sleep(800);

      await moveClick(경매.등록후_닫기버튼);
      await sleep(350);

      auctionItems[index].count += 1;
    }
  }

  return auctionItems
}

async function collectPayment(auctionItem: AuctionItems[0], currnetPage: number) {
  const buttonRegion = await loadImage(`${경매.filePath}/대금수령노란색버튼.png`);

  while (true) {
    let region: Region | null = null;

    try {
      await refresh();
      await sleep(350);
      for (let i = 0; i < currnetPage; i++) {
        await moveClick(경매.경매_오른쪽_이동);
        await sleep(500);
      }
      region = await screen.find(buttonRegion, { searchRegion: 경매.경매현황_화면 });
    } catch {
      await moveClick(경매.경매_왼쪽_초기화);
      await sleep(500);
      break;
    }

    const textRegion = new Region(823, region.top, 120, 25);

    const txt = await getText(textRegion, 7);


    if (txt.includes(auctionItem.name)) {
      logger(`${auctionItem.name} 물건을 하나 내렸어요.`);
      auctionItem.salesCount += 1;
      auctionItem.count -= 1;
    }

    await moveClick(region);
    await sleep(900);
    await moveClick(경매.경매_대금수령_닫기);
    await sleep(450);
  }

  return auctionItem;
}

async function collectPayments(auctionItems: AuctionItems) {
  const buttonRegion = await loadImage(`${경매.filePath}/대금수령노란색버튼.png`);
  let page = 1;

  logger(`팔린 대금 수령중...`);
  while (true) {
    let region: Region | null = null;

    try {
      region = await screen.find(buttonRegion, { searchRegion: 경매.경매현황_화면 });
    } catch {
      const pages = 3
      if (page < pages) {
        await moveClick(경매.경매_오른쪽_이동);
        await sleep(500);
        page += 1;

        continue;
      } else {
        await moveClick(경매.경매_왼쪽_초기화);
        break;
      }
    }

    const textRegion = new Region(823, region.top, 120, 25);

    const txt = await getText(textRegion, 7);

    auctionItems.forEach(x => {
      if (txt.includes(x.name)) {
        logger(`${x.name} 회수 완료`);
        x.salesCount += 1;
        x.count -= 1;
      }
    });

    await moveClick(region);
    await sleep(900);
    await moveClick(경매.경매_대금수령_닫기);
    await sleep(450);
  }

  return auctionItems;
}

async function findCollectItemRegion(name: string) {
  const promiseArray = new Array(10)
    .fill(null)
    .map((_, index) => {
      const textRegion = new Region(823, 경매.경매현황_화면.top + (index * 46) + 8, 120, 25);
      return new Promise<{ text: string, region: Region }>((resolve) => {
        getText(textRegion, 7)
          .then(text => {
            resolve({
              text: text.includes('23') ? '금봉' : text,
              region: textRegion,
            });
          })
          .catch(() => resolve({ text: '', region: textRegion }));
      });
    });

  const array = await Promise.all(promiseArray);
  const filteredArray = array
    .filter(x => x.text !== '')
    .filter(x => x.text.includes(name));


  return filteredArray[0]?.region ?? null;
}

async function collectItems(auctionItems: AuctionItems) {
  for await (const [index, auctionItem] of auctionItems.entries()) {
    let page = 1;

    if (!auctionItem.shouldCancelRegistration) {
      continue;
    }

    auctionItems[index].shouldCancelRegistration = false;


    if (auctionItem.count === 0) {
      continue;
    }

    logger(`${auctionItem.name} 물건 내리는 중..`);

    while (true) {
      const region = await findCollectItemRegion(auctionItem.name);

      if (region == null) {
        const pages = 3
        if (page < pages) {
          await moveClick(경매.경매_오른쪽_이동);
          page += 1;

          continue;
        } else {
          await moveClick(경매.경매_왼쪽_초기화);
          break;
        }
      }

      await mouse.move(straightTo(getRandomPosition(region)));
      await sleep(350);
      await mouse.doubleClick(Button.LEFT);

      await hasImage(`${경매.filePath}/아이템상세.png`, 2000, { searchRegion: 경매.경매현황_화면 });
      await moveClick(경매.판매취소_버튼);

      await hasImage(`${경매.filePath}/realcancel.png`, 2000, { searchRegion: 경매.경매현황_화면 });
      await moveClick(경매.판매취소_확인버튼);

      await sleep(450);
      await moveClick(경매.판매취소_확인후_닫기);

      page = 1;
      auctionItems[index].count -= 1;
    }
  }

  return auctionItems;
}

async function refresh() {
  await keyboard.pressKey(Key.F5);
  await keyboard.releaseKey(Key.F5);
}

let newAuctionItems = myAuctionItems;
export async function AuctionV2() {
  // 물건 회수하기
  await refresh()
  newAuctionItems = await collectPayments(newAuctionItems);


  for await (const [index, auctionItem] of newAuctionItems.entries()) {
    await refresh()
    let _newAuctionItems = await updatePrices([auctionItem]);

    // 물건 내리기
    await refresh()
    _newAuctionItems = await collectItems(_newAuctionItems)

    // 물건 등록하기
    await refresh()
    _newAuctionItems = await registerItems(_newAuctionItems);

    newAuctionItems[index] = _newAuctionItems[0];

    logger(`팔린 갯수: ${auctionItem.salesCount}, 현재 가격: ${auctionItem.currentPrice}, 등록 갯수: ${auctionItem.count}`);
  }


  await sleep(60_000 * 3);
}
