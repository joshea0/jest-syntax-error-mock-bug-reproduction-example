import fs from "fs";

const mockFileContents = `
jargon:
  - phrase: yak shaving
    linkTo: https://en.wiktionary.org/wiki/yak_shaving
    aliases:
      - rabbit hole
`;

describe("Module A - works", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(fs, "readFileSync").mockReturnValueOnce(mockFileContents);
    });

    it("fake test", () => {
        fs.readFileSync("foo", "utf8");
        expect(true).toEqual(true);
    });
});
