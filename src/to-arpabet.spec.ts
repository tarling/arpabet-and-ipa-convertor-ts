import { toArpabet } from './to-arpabet';

describe('PhoneticAlphabet2ARPAbet', () => {
    it('Monosyllable and ()', () => {
        // 单音节及()
        const result = toArpabet('faʊ(hh)nd');
        expect(result).toEqual('F AW1 N D');
    });

    it('Double syllable', () => {
         // ri'trai 双音节
        const result = toArpabet('riˈtraɪ');
        expect(result).toEqual('R IY0 T R AY1');
    });

    it('Trisyllable', () => {
        // ˈɛniˌwʌn, -wən 三音节
        const result = toArpabet('ˈɛniˌwʌn');
        expect(result).toEqual('EH1 N IY0 W AH2 N');
    });

    it('kʊd', () => {
        const result = toArpabet('kʊd');
        expect(result).toEqual('K UH1 D');
    });

    it('wilkinsn Double syllable', () => {
        // wilkinsn 双音节
        const result = toArpabet("'wilkinsn");
        expect(result).toEqual('W IY1 L K IY0 N S N');
    });

    it('Edge test wrong position of accent mark', () => {
        // 边缘测试 重音标识位置不对
        expect(() => {
            toArpabet("wilkins'n");
        }).toThrow('ns\' The accent mark is inappropriate, and the previous syllable of \' has no vowels!'); // ns\' 重音标识不合适，\'前一个音节没有元音！
    });

    it('Edge test Wrong accent mark and no vowel', () => {
        // 边缘测试 重音标识不对，并没有元音
        expect(() => {
            toArpabet("wilkia'ʊsn");
        }).toThrow('There is an unrecognized phonetic transcription a'); // 存在不能识别的音标 a
    });

    it('Edge test Find the completeness of the last syllable', () => {
        // 边缘测试 最后一个音节美音找完整
        expect(() => {
            toArpabet("wilki'sna");
        }).toThrow('There is an unrecognized phonetic transcription a'); // 存在不能识别的音标 a
    });

    it('Edge test. An incomplete syllable in the middle is connected to a proper phonetic symbol.', () => {
        // 边缘测试 中间一个不完整的音节连带到做好匹配不到合适的音标
        expect(() => {
            toArpabet("wilki'san");
        }).toThrow('There is an unrecognized phonetic transcription an'); // 存在不能识别的音标 an
    });
});
