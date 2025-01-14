export const ASCIILogo = () => {
    // const text = `                                                     +..=++++-.-
    //                                             %:+========+=++==++.%               ##
    //                                          %-======#*%@@@@@@@@##+===.@       %*##@#%
    //                                        %:=====#%@#**#@@@@@%#*#@%#===:@% %%%@@#@@#
    //                                     @%=====+#@#*%@@@@@%%%@@@@@@*#%##@@@@%%:...@*@
    //                                   %%=====#%@#*@@@@           @###%%%=@@@@@...%@#%
    //                                 %%=====#@@@*@@@          ***%@@+@#......%%...@@#%
    //                                %=====#@@%%%%@@       ***@@%+.....@@@#=.......@%#
    //                              +====##@%%*==%%%   ###@@@%:......-*@@@@@@@%+....-@@%##
    //                            +===**@@%%===%@@%#**%@%%@@@@....%@@@@@@@@@@@@@==-:-==:@@#*
    //                         ====#*@@@@==+#@@@*#%@%=.......%@....@%@....@@@@@@+==@%:=+=+:@@###
    //                     %+==#*@@@%#==#%@@@@@@*.......-*:...@@.....::...%@@@@%+=.@@@@#.#%@@@*#
    //                  @=+##@@@@%==*#%@@@@@@@@@@-...%@@@@@....@@+-::#@@@@@@@@@:+++@%@%@@@%@@@@%
    //               #@+%@@@@*==##@@@@%#.......@@@....@@@%....*@@#++=%@@@:-++:@ :%@@#@@@%@@@@
    //              #%*++++*#%@@@@@@@:...........@@......::::@@@@@+++++++++=:#@@@%#%@ %%%
    //              #%@@%@@@@@@*..#@....#@@@@@....@@.:::#%==+=+.@@@++++--%@@@@%@@@@@%
    //             %%%%@@@@-......@@...@@@@@@@@#@%%@@+++%@@@%.===+-@=%@@@@@%%%##@@
    //          ###%@@@:.......*@@@%...%@%...@@=+++-@+=++@@@@@@#:#@@@@@@@@%#++#%%*   .RS
    //       ##@@@-.......*...@@@@@@#@@@@@=.*@@@.+=.@@+++=@@@@%@@@@@%%--+#%@@@@+=%+
    //        @%%@@@@%*%@@@=..:@@@@@@:++.@@@@@@-++=@@@@ #%@@%%@@%%--*%@@@@+.==+++*%#
    //        %@%%@@@@@@@@@@....@@@@@%=++++.:++++:@@@@@@@%@@%%@--#@@@@:----==*#%@*%
    //         %%@%%@@=++:@@@:==.@@@@@%+=+++++=.#@@#@@@@@%*@%-=%@@@.-----##@@
    //           @@%%%%===@@@@==+.%@@@@@@%@@@@@@@%@@   %#@@-*@@@%.::::+%@
    //               *@*===@@@++++@@@@@@@%%%%%%@@@@    %%@*@@@#:::::#%
    //                  -==-@@@-==.@@%  @@@@@@@        %#@@@*:::::-#
    //                   --==@@@@@@@%%                ##@@%:::::.#
    //                    =----@@@@@@@             %#*%@%.:::::#
    //                     #--===@@###          ###*@@+::::::*#
    //                       *----.@@@%*********#@@@.::::::+#
    //                        @*-----::#@@@@@@@*.:::::::.##
    //                           %*-----::::::::::::::+##
    //                               ##-::::::::.=###`

    const text = `                                                     #@@=####-@-
                                      %##========#=##==##@%               ::
                                   %-======:*%........::#===@.       %*::.:%
                                 %#=====:%.:**:.....%:*:.%:===#.% %%%..:..:
                              .%=====#:.:*%.....%%%......*:%::....%%#@@@.*.
                            %%=====:%.:*....           .:::%%%=.....@@@%.:%
                          %%=====:...*...          ***%..#.:@@@@@@%%@@@..:%
                         %=====:..%%%%..       ***..%#@@@@@...:=@@@@@@@.%:
                       #====::.%%*==%%%   :::...%#@@@@@@-*.......%#@@@@-..%::
                     #===**..%%===%..%:**%.%%....@@@@%.............==-#-==#..:*
                  ====:*....==#:...*:%.%=@@@@@@@%.@@@@.%.@@@@......#==.%#=#=##..:::
              %#==:*...%:==:%......*@@@@@@@-*#@@@..@@@@@##@@@%....%#=@....:@:%...*:
           .=#::....%==*:%..........-@@@%.....@@@@..#-##:.........####.%.%...%....%
        :.#%....*==::....%:@@@@@@@...@@@@...%@@@@*..:##=%...#-###. #%..:...%....
       :%*####*:%.......#@@@@@@@@@@@..@@@@@@####.....#########=#:...%:%. %%%
       :%..%......*@@:.@@@@:.....@@@@..@###:%==#=#@...####--%....%.....%
      %%%%....-@@@@@@..@@@........:.%%..###%...%@===#-.=%.....%%%::..       
   :::%...#@@@@@@@*...%@@@%.%@@@..=###-.#=##......:#:........%:##:%%*   @RS
::...-@@@@@@@*@@@......:.....=@*...@#=@..###=....%.....%%--#:%....#=%#  
 .%%....%*%...=@@#......###@......-##=.... :%..%%..%%--*%....#@==###*%:
 %.%%..........@@@@.....%=####@######.......%..%%.--:....#----==*:%.*%
  %%.%%..=###...#==@.....%#=#####=@:..:.....%*.%-=%...@-----::..
    ..%%%%===....==#@%......%.......%..   %:..-*...%@#####%.
        *.*===...####.......%%%%%%....    %%.*...:#####:%
           -==-...-==@..%  .......        %:...*#####-:
            --==.......%%                ::..%#####@:
             =----.......             %:*%.%@#####:
              :--===..:::          :::*..#######*:
                *----@...%*********:...@#######:
                 .*-----##:.......*@#######@::
                    %*-----###############::
                        ::-########@=:::`
    // const codepage = `                                                     ▒  ▒▒▒▒▒░ ░
    //                                             █░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ █               ▓▓
    //                                          █░▒▒▒▒▒▒▓▓█████████▓▓▒▒▒▒ █       █▓▓▓█▓█
    //                                        █░▒▒▒▒▒▓██▓▓▓▓██████▓▓▓██▓▒▒▒░██ █████▓██▓
    //                                     ██▒▒▒▒▒▒▓█▓▓███████████████▓▓█▓▓██████░   █▓█
    //                                   ██▒▒▒▒▒▓██▓▓████           █▓▓▓███▒█████   ██▓█
    //                                 ██▒▒▒▒▒▓███▓███          ▓▓▓███▒█▓      ██   ██▓█
    //                                █▒▒▒▒▒▓████████       ▓▓▓███▒     ███▓▒       ██▓
    //                              ▒▒▒▒▒▓▓███▓▒▒███   ▓▓▓████░      ░▓████████▒    ░███▓▓
    //                            ▒▒▒▒▓▓████▒▒▒████▓▓▓████████    ██████████████▒▒░░░▒▒░██▓▓
    //                         ▒▒▒▒▓▓████▒▒▒▓███▓▓███▒       ██    ███    ██████▒▒▒██░▒▒▒▒░██▓▓▓
    //                     █▒▒▒▓▓████▓▒▒▓███████▓       ░▓░   ██     ░░   ██████▒▒ ████▓ ▓████▓▓
    //                  █▒▒▓▓█████▒▒▓▓███████████░   ██████    ██▒░░░▓█████████░▒▒▒█████████████
    //               ▓█▒█████▓▒▒▓▓█████▓       ███    ████    ▓██▓▒▒▒████░░▒▒░█ ░███▓████████
    //              ▓█▓▒▒▒▒▓▓████████░           ██      ░░░░█████▒▒▒▒▒▒▒▒▒▒░▓████▓██ ███
    //              ▓██████████▓  ▓█    ▓█████    ██ ░░░▓█▒▒▒▒▒ ███▒▒▒▒░░████████████
    //             ████████░      ██   ████████▓█████▒▒▒█████ ▒▒▒▒░█▒█████████▓▓██
    //          ▓▓▓████░       ▓████   ███   ██▒▒▒▒░█▒▒▒▒██████▓░▓█████████▓▒▒▓██▓
    //       ▓▓███░       ▓   ██████▓█████▒ ▓███ ▒▒ ██▒▒▒▒████████████░░▒▓█████▒▒█▒
    //        ████████▓████▒  ░██████░▒▒ ██████░▒▒▒████ ▓█████████░░▓█████▒ ▒▒▒▒▒▓█▓
    //        ██████████████    ██████▒▒▒▒▒ ░▒▒▒▒░█████████████░░▓████░░░░░▒▒▓▓██▓█
    //         ███████▒▒▒░███░▒▒ ██████▒▒▒▒▒▒▒▒ ▓██▓██████▓██░▒████ ░░░░░▓▓██
    //           ██████▒▒▒████▒▒▒ ██████████████████   █▓██░▓████ ░░░░▒██
    //               ▓█▓▒▒▒███▒▒▒▒█████████████████    ███▓███▓░░░░░▓█
    //                  ░▒▒░███░▒▒ ███  ███████        █▓███▓░░░░░░▓
    //                   ░░▒▒█████████                ▓▓███░░░░░ ▓
    //                    ▒░░░░███████             █▓▓███ ░░░░░▓
    //                     ▓░░▒▒▒██▓▓▓          ▓▓▓▓██▒░░░░░░▓▓
    //                       ▓░░░░ ████▓▓▓▓▓▓▓▓▓▓███ ░░░░░░▒▓
    //                        █▓░░░░░░░▓███████▓ ░░░░░░░ ▓▓
    //                           █▓░░░░░░░░░░░░░░░░░░░▒▓▓
    //                               ▓▓░░░░░░░░░ ▒▓▓▓`
    return (
        <div id={'ascii-logo'}>
            <pre>
                {text.split('\n').map((line, index, arr) => {
                    // Calculate gradient color
                    // let col = 'rgb(0,234,255)';
                    // const startColor = [154, 58, 255];
                    // const endColor = [18, 191, 255];
                    const startColor = [200, 0, 255];
                    const endColor = [0, 234, 255];
                    const ratio = index / (arr.length - 1);
                    const color = startColor.map((start, i) =>
                        Math.round(start + (endColor[i] - start) * ratio)
                    );
                    return (
                        <span
                            key={index}
                            style={{color: `rgb(${color.join(',')})`}}
                        >
                            {line}
                            <br/>
                        </span>
                    );
                })}
            </pre>
        </div>
    );
};