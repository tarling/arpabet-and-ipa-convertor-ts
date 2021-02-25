import { toAmericanPhoneticAlphabet } from './to-phonetic-alphabets';

describe('ARPAbet2PhoneticAlphabet', () => {
    it('Monosyllable', () => {
        // 单音节
        const result = toAmericanPhoneticAlphabet('F AW1 N D');
        expect(result).toEqual('faʊnd');
    });

    it('Double syllable', () => {
        // ri'trai  双音节
        const result = toAmericanPhoneticAlphabet('R IY0 T R AY1');
        expect(result).toEqual('riˈtraɪ');
    });

    it('Trisyllable', () => {
        // ˈɛniˌwʌn, -wən 三音节
        const result = toAmericanPhoneticAlphabet('EH1 N IY0 W AH2 N');
        expect(result).toEqual('ˈɛniˌwʌn');
    });

    it('Monosyllable', () => {
        // kʊd 单音节
        const result = toAmericanPhoneticAlphabet('K UH1 D');
        expect(result).toEqual('kʊd');
    });

    it('Double syllable', () => {
        // 双音节
        const result = toAmericanPhoneticAlphabet("W IY1 L K IY0 N S N")
        expect(result).toEqual('ˈwilkinsn');
    });

    it('Edge test: wrong accent mark', () => {
        // 边缘测试：重音标识不对
        expect(() => {
            toAmericanPhoneticAlphabet("W IY1 L K IY4 N S N");
        }).toThrow('The accent mark of IY is wrong, it is marked as 4'); // IY 的重音标识不对，标记成了 4
    });

    it('Edge test: ARPAbet is wrong', () => {
        // 边缘测试：ARPAbet不对
        expect(() => {
            toAmericanPhoneticAlphabet("W IY1 L K IG N S N");
        }).toThrow('IG does not match the appropriate phonetic transcription'); // IG 匹配不到合适的音标
    });

    it('Edge test: wrong accent mark position', () => {
        // 边缘测试：重音标识位置不对
        expect(() => {
            toAmericanPhoneticAlphabet("W IY1 L K IY N1 S N");
        }).toThrow('N1 The accent mark is in the wrong position, the current N is not a vowel'); // N1 重音标识位置不对，当前 N 不是元音
    });

    it('Edge test: ARPAbet marked with accent is wrong', () => {
         // 边缘测试：标记重音的ARPAbet不对
        expect(() => {
            toAmericanPhoneticAlphabet("W IY1 L K IY X1 S N");
        }).toThrow('X does not match the appropriate phonetic transcription'); // X 匹配不到合适的音标
    });
});
