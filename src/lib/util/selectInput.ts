export const selectInput = (ref: React.RefObject<HTMLInputElement>) => {
    if ((ref.current?.value.length ?? 0) > 0) ref.current?.select();
};
