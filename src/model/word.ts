import { Stress } from './stress';
import { Syllable } from './syllable';
export class Word {
    private syllables: Syllable[] = [];
    private stressCount = 0;

    addSyllable(syllable:Syllable): void {
        if (((! syllable) || syllable.isEmpty())) {
            return;
        }
        this.syllables.push(syllable);
        if (syllable.haveVowel) {
            this.stressCount += 1;
        }
    }
    toArpabet(): string {
        const translations = this.syllables.map((syllable) => {
            if ((syllable.haveVowel && (this.stressCount <= 1))) {
                syllable.stress = Stress.Primary;
            }
            return syllable.toArpabet()
        });
        return translations.join(' ');
    }
    toAmericanPhoneticAlphabet(): string {
        let translations = '';
        this.syllables.forEach((syllable, i) => {
            translations += syllable.toAmericanPhoneticAlphabet(((0 === i) && (1 >= this.stressCount)));
        });
        return translations;
    }
    toEnglishPhoneticAlphabet(): string {
        let translations = '';
        this.syllables.forEach((syllable, i) => {
            translations += syllable.toEnglishPhoneticAlphabet(((0 === i) && (1 >= this.stressCount)));
        });

        return translations;
    }
    toIPA(): string {
        let translations = '';
        this.syllables.forEach((syllable, i) => {
            translations += syllable.toIPA((0 === i) && (1 >= this.stressCount));
        });
        return translations;
    }
}
