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

const skip = [
  ["(", ")"],
  ["\uff08", "\uff09"],
];
const skipDict: Record<string, string> = {};
skip.forEach(skip => {
    skipDict[skip[0]] = skip[1];
});

const stressDict: Record<string, Stress> = {};

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

function findPhonemeInPhonemeTrees(phonemeString:string, phonemeTrees: PhonemeTree[]): Phoneme | null {
    for (const phonemeTree of phonemeTrees) {
        const phoneme = phonemeTree[phonemeString];
        if (phoneme) {
            return phoneme;
        }
    }
    return null;
}

function createPhonemeTreesList(priority: ConvertPriority): PhonemeTree[] {
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

export function toArpabet(input: string, priority = ConvertPriority.American): string | null {
    if ((! input)) {
        return null;
    }
    let tempCh = "";
    const skipStack: string[] = [];
    const phonemeTrees = createPhonemeTreesList(priority);
    let lastPhoneme: Phoneme | null = null;
    const word = new Word();
    let syllable = new Syllable();
    let tempSyllableStr = "";
    const chars = input.split('');
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
                throw new PhonemeError(`There is an unrecognized phonetic transcription ${tempCh}`);
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
                tempCh = "";
                tempSyllableStr = ch;
                syllable.stress = stress;
                return;
            }
        }
        tempCh += ch;
        const tempPhoneme = findPhonemeInPhonemeTrees(tempCh, phonemeTrees);
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
            tempCh = ch;
            lastPhoneme = findPhonemeInPhonemeTrees(tempCh, phonemeTrees);
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
        throw new PhonemeError(`There is an unrecognized phonetic transcription ${tempCh}`);
    }
    return word.toArpabet();
}
