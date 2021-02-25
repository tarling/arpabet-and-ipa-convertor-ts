import { consonants, vowels } from './phonemes';
import { PhonemeError } from './phoneme-error';
import { Phoneme } from './model/phoneme';
import { Stress } from './model/stress';
import { Syllable } from './model/syllable';
import { Word } from './model/word';

/*
Stress and auxiliary symbols[3]
AB	Description
0	No stress
1	Primary stress
2	Secondary stress
3...	Tertiary and futher stress
-	Silence
!	Non-speech segment
+	Morpheme boundary
/	Word boundary
#	Utterance boundary
:	Tone group boundary
:1 or .	Falling or declining juncture
:2 or ?	Rising or internal juncture
:3 or .	Fall-rise or non-term juncture*/


enum ConvertPriority {
  American,
  English,
  IPA,
}

type PhonemeTree = Record<string, Phoneme>;

const ipaTree: PhonemeTree = {};
const kkTree: PhonemeTree = {};
const djTree: PhonemeTree = {};

vowels.forEach(o => {
    ipaTree[o.ipa] = o;
    kkTree[o.american] = o;
    djTree[o.english] = o;
});
consonants.forEach(o => {
    ipaTree[o.ipa] = o;
    kkTree[o.american] = o;
    djTree[o.english] = o;
});

const skipDict: Record<string, string> = {};
const stressDict: Record<string, Stress> = {};


const skip = [
  ["(", ")"],
  ["\uff08", "\uff09"],
];
skip.forEach(skip => {
    skipDict[skip[0]] = skip[1];
});

const primaryStressIpa = ["'", "\u02c8"];
primaryStressIpa.forEach(str => {
    stressDict[str] = Stress.Primary;
});

const secondaryStressIpa = ["\u02cc"];
secondaryStressIpa.forEach(str => {
    stressDict[str] = Stress.Secondary;
});

const ipaStops = [",", "-"];
function isStop(c:string): boolean {
    return ipaStops.includes(c);
}

function findPhonemeInArphabetList(phonemeString:string, arphabets: PhonemeTree[]): Phoneme | null {
    for (const arphabet of arphabets) {
        const phoneme = arphabet[phonemeString];
        if (phoneme) {
            return phoneme;
        }
    }
    return null;
}

function createArphabetsList(priority: ConvertPriority): PhonemeTree[] {
    if ((ConvertPriority.American === priority)) {
        return [kkTree, ipaTree, djTree];
    }
    if ((ConvertPriority.English === priority)) {
        return [djTree, ipaTree, kkTree];
    }
    if ((ConvertPriority.IPA === priority)) {
        return [ipaTree, kkTree, djTree];
    }
    throw new Error('Priority not recognised');
}

export function convert(arphabet: string, priority = ConvertPriority.American): string | null {
    if ((! arphabet)) {
        return null;
    }
    let temp_ch = "";
    const skipStack: string[] = [];
    const arphabet_list = createArphabetsList(priority);
    let lastPhoneme: Phoneme | null = null;
    const word = new Word();
    let syllable = new Syllable();
    let tempSyllableStr = "";
    const chars = arphabet.split('');
    chars.forEach((ch, index) => {
        if (isStop(ch)) {
            return;
        }
        tempSyllableStr += ch;
        if (skipStack.length) {
            if ((ch === skipDict[skipStack.slice((- 1))[0]])) {
                skipStack.pop();
            }
            return;
        } else {
            if (skipDict[ch]) {
                skipStack.push(ch);
                return;
            }
        }
        const stress = stressDict[ch];
        if (stress) {
            if (((! lastPhoneme) && (index > 0))) {
                // 存在不能识别的音标 ${temp_ch}
                throw new PhonemeError(`There is an unrecognized phonetic transcription ${temp_ch}`);
            } else {
                /*
                遇到重音标识，说明前面是是一个音节，添加到word中，并清空last_phoneme及temp_ch
                */
                if (lastPhoneme) {
                    syllable.addPhoneme(lastPhoneme);
                    if ((! syllable.haveVowel)) {
                        // ${tempSyllableStr} 重音标识不合适，${ch}前一个音节没有元音！
                        throw new PhonemeError(`${tempSyllableStr} The accent mark is inappropriate, and the previous syllable of ${ch} has no vowels!`);
                    }
                    word.addSyllable(syllable);
                    syllable = new Syllable();
                }
                lastPhoneme = null;
                temp_ch = "";
                tempSyllableStr = ch;
                syllable.stress = stress;
                return;
            }
        }
        temp_ch += ch;
        const tempPhoneme = findPhonemeInArphabetList(temp_ch, arphabet_list);
        if ((lastPhoneme && (! tempPhoneme))) {
            /*
            说明前面是是一个完整音标
            */
            syllable.addPhoneme(lastPhoneme);
            if (lastPhoneme.isVowel) {
                word.addSyllable(syllable);
                syllable = new Syllable();
                tempSyllableStr = ch;
            }
            temp_ch = ch;
            lastPhoneme = findPhonemeInArphabetList(temp_ch, arphabet_list);
        } else {
            lastPhoneme = tempPhoneme;
        }
    });
    if (lastPhoneme) {
        syllable.addPhoneme(lastPhoneme);
        if ((syllable.stress && (! syllable.haveVowel))) {
            // ${tempSyllableStr} 有重音标识但并没有元音！
            throw new PhonemeError(`${tempSyllableStr} has accent marks but no vowels!`);
        }
        word.addSyllable(syllable);
    } else {
        // 存在不能识别的音标 ${temp_ch}
        throw new PhonemeError(`There is an unrecognized phonetic transcription ${temp_ch}`);
    }
    return word.toArpabet();
}
