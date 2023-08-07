import { Region } from "@nut-tree/nut-js";

export const 경매 = {
  filePath: `./src/assets/auction`,
  내_경매: new Region(599, 292, 45, 19),
  아이템_등록: new Region(1295, 326, 90, 20),
  검색어를_입력하세요: new Region(1666, 51, 97, 19),
  아이템_리스트: new Region(1536, 226, 361, 410),
  등록최저가_리스트_버튼: new Region(1090, 448, 28, 13),
  등록최저가_리스트: new Region(860, 424, 215, 300),
  등록최저가_리스트_닫기버튼: new Region(950, 746, 46, 26),
  아이템_등록_닫기버튼: new Region(991, 781, 54, 34),
  현재가격: new Region(975, 548, 112, 17),
  아이템_등록_등록버튼: new Region(891, 781, 54, 34),
  등록후_닫기버튼: new Region(1031, 595, 35, 22),
  경매현황_화면: new Region(548, 387, 826, 458),
  판매취소_버튼: new Region(941, 697, 54, 34),
  판매취소_확인버튼: new Region(986, 602, 34, 21),
  판매취소_확인후_닫기: new Region(1031, 602, 34, 21),
  경매_오른쪽_이동: new Region(1031, 866, 6, 13),
  경매_왼쪽_초기화: new Region(866, 866, 10, 13),
  경매_대금수령_닫기: new Region(1031, 644, 34, 21),
} as const