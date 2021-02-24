/*
音节*/
import { Phoneme } from './phoneme';
import { Stress } from './stress';
export class Syllable {
    public stress: Stress | null = null;
    private _haveVowel = false;
    private phonemes: Phoneme[] = [];

    get haveVowel():boolean {
        return this._haveVowel;
    }
    isEmpty():boolean {
        return (this.phonemes.length <= 0);
    }
    addPhoneme(phoneme: Phoneme):void {
        if ((! phoneme)) {
            return;
        }
        this.phonemes.push(phoneme);
        if (phoneme.isVowel) {
            if ((! this.stress)) {
                this.stress = Stress.No;
            }
            this._haveVowel = true;
        }
    }
    toArpabet():string {
        // 转换成arpabet
        return this.phonemes.map(phoneme => {
            if (phoneme.isVowel) {
                return phoneme.arpabet + this.stress?.markArpabet();
            } else {
                return phoneme.arpabet;
            }
        }).join(' ');
    }
    toAmericanPhoneticAlphabet(hideStressMark = false): string | undefined  {
        // 转换成美音音。只要一个元音的时候需要隐藏重音标识
        let translations = (((! hideStressMark) && this.haveVowel) ? this.stress?.markIpa() : "");
        this.phonemes.forEach(phoneme => {
            translations += phoneme.american;
        });
        return translations;
    }
    toEnglishPhoneticAlphabet(hideStressMark = false): string | undefined  {
        // 转换成英音。只要一个元音的时候需要隐藏重音标识
        let translations = (((! hideStressMark) && this.haveVowel) ? this.stress?.markIpa() : "");
        this.phonemes.forEach(phoneme => {
            translations += phoneme.english;
        });
        return translations;
    }
    toIPA(hideStressMark = false): string | undefined  {
        // 转换成国际音标。只要一个元音的时候需要隐藏重音标识ß
        let translations = (((! hideStressMark) && this.haveVowel) ? this.stress?.markIpa() : "");
        this.phonemes.forEach(phoneme => {
            translations += phoneme.ipa;
        });
        return translations;
    }
}
