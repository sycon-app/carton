export function print(text: string) {
    const printwindow = window.open("", "PRINT", "height=400,width=600");

    if (!printwindow) return;

    printwindow.document.write("<head></head><body><pre>");
    printwindow.document.write(text);
    printwindow.document.write("</pre></body></html>");
    printwindow.document.close(); // necessary for IE >= 10
    printwindow.focus(); // necessary for IE >= 10
    printwindow.print();
    printwindow.close();
}
