enum StressType {
    No,
    Primary,
    Secondary,
}

export class Stress {
    public static No = new Stress(StressType.No, ''); // 无重音
    public static Primary = new Stress(StressType.Primary, '\u02c8'); // 重音
    public static Secondary = new Stress(StressType.Secondary, '\u02cc'); // 次重音

    private constructor(public type: StressType, private ipa: string ) {}
    markIpa(): string {
        return this.ipa;
    }
    markArpabet(): number {
        return this.type;
    }
}
