import { consonants, vowels } from './phonemes';
import { PhonemeError } from "./phoneme-error";
import { Syllable } from "./model/syllable";
import { Word } from "./model/word";
import { Stress } from "./model/stress";
import { Phoneme } from "./model/phoneme";

const arpabetTree: Record<string, Phoneme> = {};
vowels.forEach((o) => {
    arpabetTree[o.arpabet] = o;
});
consonants.forEach((o) => {
    arpabetTree[o.arpabet] = o;
});

const stressDict: Record<string, Stress> = {
    [Stress.No.type]: Stress.No,
    [Stress.Primary.type]: Stress.Primary,
    [Stress.Secondary.type]: Stress.Secondary,
};

function toWord(arpabet: string): Word | null {
    if (!arpabet) {
        return null;
    }
    let before: string;
    let lastNum: string;
    let phoneme: Phoneme;
    let stress: Stress;
    const arpabetPhonemes = arpabet.split(' ');
    const word = new Word();
    let syllable = new Syllable();
    for (const arphabetPhoneme of arpabetPhonemes) {
        phoneme = arpabetTree[arphabetPhoneme];
        if (phoneme) {
            syllable.addPhoneme(phoneme);
            if (phoneme.isVowel) {
                word.addSyllable(syllable);
                syllable = new Syllable();
            }
        } else {
            lastNum = arphabetPhoneme.slice(-1)[0];
            if (isNaN(parseInt(lastNum))) {
                throw new PhonemeError(
                    // 匹配不到合适的音标
                    `${arphabetPhoneme} does not match the appropriate phonetic transcription`
                );
            }
            stress = stressDict[lastNum];
            before = arphabetPhoneme.slice(0, -1);
            phoneme = arpabetTree[before];
            if (phoneme) {
                syllable.addPhoneme(phoneme);
                if (stress) {
                    syllable.stress = stress;
                } else {
                    throw new PhonemeError(
                        // 的重音标识不对，标记成了
                        `The accent mark of ${before} is wrong, it is marked as ${lastNum}`
                    );
                }
                if (phoneme.isVowel) {
                    word.addSyllable(syllable);
                    syllable = new Syllable();
                } else {
                    throw new PhonemeError(
                        // ${arphabe_phoneme} 重音标识位置不对，当前 ${before} 不是元音
                        `${arphabetPhoneme} The accent mark is in the wrong position, the current ${before} is not a vowel`
                    );
                }
            } else {
                throw new PhonemeError(
                    // ${before} 匹配不到合适的音标
                    `${before} does not match the appropriate phonetic transcription`
                );
            }
        }
    }
    word.addSyllable(syllable);
    return word;
}
export function toIPA(arpabet:string): string | null {
    // 转换成国际音标
    const word = toWord(arpabet);
    if (!word) {
        return null;
    }
    return word.toIPA();
}
export function toAmericanPhoneticAlphabet(arpabet:string): string | null {
    // 转换成美音
    const word = toWord(arpabet);
    if (!word) {
        return null;
    }
    return word.toAmericanPhoneticAlphabet();
}
export function toEnglishPhoneticAlphabet(arpabet:string): string | null {
    /// 转换成英音
    const word = toWord(arpabet);
    if (!word) {
        return null;
    }
    return word.toEnglishPhoneticAlphabet();
}
