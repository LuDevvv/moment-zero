export function BackgroundEffects() {
    return (
        <>
            <div className="absolute inset-0 bg-linear-to-br from-background via-background to-accent/10 -z-20 transition-colors duration-300" />
            <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse -z-10 pointer-events-none bg-orb" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-accent/10 rounded-full blur-[120px] mix-blend-screen animate-pulse -z-10 pointer-events-none bg-orb" style={{ animationDelay: "1s" }} />
        </>
    );
}
