import { consonants, vowels } from './phonemes';
import { PhonemeError } from './phoneme-error';
import { Phoneme } from './model/phoneme';
import { Stress } from './model/stress';
import { Syllable } from './model/syllable';
import { Word } from './model/word';

enum ConvertPriority {
    American,
    English,
    IPA,
}

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
const primaryStressIpa = ["'", "\u02c8"];
const secondaryStressIpa = ["\u02cc"];
const ipaStops = [",", "-"];
const skip = [
    ["(", ")"],
    ["\uff08", "\uff09"],
];

type PhonemeTree = Record<string, Phoneme>;

export class PhoneticAlphabet2ARPAbet {
    private ipaTree: PhonemeTree = {};
    private kkTree: PhonemeTree = {};
    private djTree: PhonemeTree = {};

    private stopsDict: Record<string, boolean> = {};
    private skipDict: Record<string, string> = {};
    private stressDict: Record<string, Stress> = {};

    constructor() {
        /*
        装配数据
        */
        vowels.forEach(o => {
            this.ipaTree[o.ipa] = o;
            this.kkTree[o.american] = o;
            this.djTree[o.english] = o;
        });
        consonants.forEach(o => {
            this.ipaTree[o.ipa] = o;
            this.kkTree[o.american] = o;
            this.djTree[o.english] = o;
        });

        ipaStops.forEach(str => {
            this.stopsDict[str] = true;
        });

        skip.forEach(skip => {
            this.skipDict[skip[0]] = skip[1];
        });

        primaryStressIpa.forEach(str => {
            this.stressDict[str] = Stress.Primary;
        });

        secondaryStressIpa.forEach(str => {
            this.stressDict[str] = Stress.Secondary;
        });
    }
    private isStop(c:string): boolean {
        return this.stopsDict[c] === true;
    }
    private findPhonemeInArphabetList(phoneme_string:string, arphabets: PhonemeTree[]): Phoneme | null {
        for (const arphabet of arphabets) {
            const phoneme = arphabet[phoneme_string];
            if (phoneme) {
                return phoneme;
            }
        }
        return null;
    }
    private createArphabetsList(priority: ConvertPriority): PhonemeTree[] {
        if ((ConvertPriority.American === priority)) {
            return [this.kkTree, this.ipaTree, this.djTree];
        }
        if ((ConvertPriority.English === priority)) {
            return [this.djTree, this.ipaTree, this.kkTree];
        }
        if ((ConvertPriority.IPA === priority)) {
            return [this.ipaTree, this.kkTree, this.djTree];
        }
        throw new Error('Priority not recognised');
    }
    convert(arphabet: string, priority = ConvertPriority.American): string | null {
        if ((! arphabet)) {
            return null;
        }
        let temp_ch = "";
        const skipStack: string[] = [];
        const arphabet_list = this.createArphabetsList(priority);
        let lastPhoneme: Phoneme | null = null;
        const word = new Word();
        let syllable = new Syllable();
        let tempSyllableStr = "";
        const chars = arphabet.split('');
        chars.forEach((ch, index) => {
            if (this.isStop(ch)) {
                return;
            }
            tempSyllableStr += ch;
            if (skipStack.length) {
                if ((ch === this.skipDict[skipStack.slice((- 1))[0]])) {
                    skipStack.pop();
                }
                return;
            } else {
                if (this.skipDict[ch]) {
                    skipStack.push(ch);
                    return;
                }
            }
            const stress = this.stressDict[ch];
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
            const tempPhoneme = this.findPhonemeInArphabetList(temp_ch, arphabet_list);
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
                lastPhoneme = this.findPhonemeInArphabetList(temp_ch, arphabet_list);
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
}
