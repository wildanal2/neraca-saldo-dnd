import { find, sumBy } from "lodash";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import ItemsDataSoal from "./ItemsDataSoal";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [jawab, setJawab] = useState(null);
  const [checking] = useState(false);
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  useEffect(() => {
    const fetch = () => {
      const nanoid = customAlphabet(alphabet, 6);
      const apiData = [
        {
          name: "PT. Charta Indo",
          tgl: "03-Nov-2021",
          jumlah: 6000000,
          jenis: "hutang",
          posisi: "kredit",
        },
        {
          name: "PT. Paperfine",
          tgl: "20-Nov-2021",
          jumlah: 8500000,
          jenis: "hutang",
          posisi: "kredit",
        },
        {
          name: "CV. Big Boss",
          tgl: "27-Nov-2021",
          jumlah: 2000000,
          jenis: "piutang",
          posisi: "debit",
        },
      ];

      const tmp = apiData.map((item) => ({
        ...item,
        uuid: nanoid(),
        soal_name: item.name,
        soal_tgl: item.tgl,
        soal_jumlah: item.jumlah,
        jwb_name: null,
        jwb_tgl: null,
        jwb_jumlah_debit: null,
        jwb_jumlah_kredit: null,
        err_name: false,
        err_tgl: false,
        err_jumlah: false,
      }));
      setJawab(tmp);
    };
    fetch();
  }, []);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; //jika dopable tujuan tidak null
    // get id dest & source
    const idsource = source.droppableId.split("_");
    const iddest = destination.droppableId.split("_");
    const isrc = jawab.findIndex((x) => x.uuid === idsource[2]);
    const idst = jawab.findIndex((x) => x.uuid === iddest[2]);

    //cek drop bukan di tempat yang sama
    if (source.droppableId !== destination.droppableId) {
      //Larangan
      if (idsource[0] === "src" && idsource[0] === iddest[0]) return; //batal src <-> src
      if (idsource[0] === "dst" && iddest[0] === "src") return; //batal dst ->src
      //Allowed
      if (idsource[1] === iddest[1]) {
        //is switch ?
        if (idsource[0] === iddest[0]) {
          //Khusus Jumlah
          if (iddest[1] === "jumlah") {
            if (iddest[2] === idsource[2]) {
              //switch untuk Jumlah baris sama (debit<->kredit)
              const itmdstt = {
                ...jawab[idst],
                ["jwb_" + iddest[1] + "_" + iddest[3]]:
                  jawab[idst]["jwb_" + iddest[1] + "_" + idsource[3]],
                ["jwb_" + iddest[1] + "_" + idsource[3]]:
                  jawab[idst]["jwb_" + iddest[1] + "_" + iddest[3]],
              };
              const dstup = jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdstt
              );
              setJawab(dstup);
            } else {
              //switch untuk Jumlah BEDA baris (debit<->kredit)
              //kondisi harus blank 2(deb/kre) or crash
              if (
                (!jawab[idst].jwb_jumlah_kredit &&
                  !jawab[idst].jwb_jumlah_debit) ||
                jawab[idst]["jwb_jumlah_" + iddest[3]]
              ) {
                //update 1 switch
                const itmdst = {
                  ...jawab[idst],
                  ["jwb_jumlah_" + iddest[3]]:
                    jawab[isrc]["jwb_jumlah_" + idsource[3]],
                };
                const itmsrc = {
                  ...jawab[isrc],
                  ["jwb_jumlah_" + idsource[3]]:
                    jawab[idst]["jwb_jumlah_" + iddest[3]],
                };
                const dstup = jawab.map((u) =>
                  u.uuid !== iddest[2] ? u : itmdst
                );
                //update 2
                const finalup = dstup.map((u) =>
                  u.uuid !== idsource[2] ? u : itmsrc
                );
                setJawab(finalup);
              } else {
                toast.error("Switch Area terpilih sudah terisi");
                return;
              }
            }
          } else {
            //update 1 ,switch
            const itmdst = {
              ...jawab[idst],
              ["jwb_" + iddest[1]]: jawab[isrc]["jwb_" + idsource[1]],
            };
            console.log(jawab[idst]["jwb_" + iddest[1]]);
            const itmsrc = {
              ...jawab[isrc],
              ["jwb_" + idsource[1]]: jawab[idst]["jwb_" + iddest[1]],
            };
            const dstup = jawab.map((u) => (u.uuid !== iddest[2] ? u : itmdst));
            //update 2
            const finalup = dstup.map((u) =>
              u.uuid !== idsource[2] ? u : itmsrc
            );
            setJawab(finalup);
          }
        } else {
          //is migrasi
          //next, crash ?
          if (
            jawab[idst][
              iddest[1] === "jumlah"
                ? "jwb_" + iddest[1] + "_" + iddest[3]
                : "jwb_" + iddest[1]
            ] !== null
          ) {
            // console.log("is crash");
            toast.error("Pastikan drop di area yang kosong");
            return;
          } else {
            // console.log("good place");
            //check "good place" is not existed jumlah
            //PROSESSS
            //#region
            if (
              iddest[1] === "jumlah" &&
              (jawab[idst].jwb_jumlah_kredit || jawab[idst].jwb_jumlah_debit)
            ) {
              toast.error("Area sudah terisi");
              return;
            }

            if (iddest[2] === jawab[isrc].uuid) {
              //di jawaban benar n0t: fix issue for true uuid not saved in twice set
              const itmdstt = {
                ...jawab[idst],
                ["soal_" + iddest[1]]: null,
                [iddest[1] === "jumlah"
                  ? "jwb_" + iddest[1] + "_" + iddest[3]
                  : "jwb_" + iddest[1]]: idsource[2],
              };
              const dstup = jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdstt
              );
              setJawab(dstup);
            } else {
              //update 1
              const itmdst = {
                ...jawab[idst],
                [iddest[1] === "jumlah"
                  ? "jwb_" + iddest[1] + "_" + iddest[3]
                  : "jwb_" + iddest[1]]: idsource[2],
              };
              const dstup = jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdst
              );
              //update 2
              const itmsrc = {
                ...jawab[isrc],
                ["soal_" + iddest[1]]: null,
              };
              const finalup = dstup.map((u) =>
                u.uuid !== idsource[2] ? u : itmsrc
              );
              setJawab(finalup);
            }
            //#endregion
          }
        }
      } else {
        toast.error("Pastikan drop di area yang sesuai");
      }
    }
    // console.log(result);
    // console.log(JSON.stringify(jawab));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* SOAL START*/}
      <div className="bg-slate-100 py-5">
        <table className="border-collapse w-1/2 mx-auto  table-fixed">
          <thead>
            <tr>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-gray-50 text-gray-600 border border-gray-200 ">
                Pemasok
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-gray-50 text-gray-600 border border-gray-200 ">
                Tanggal Beli
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-gray-50 text-gray-600 border border-gray-200 ">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {jawab &&
              jawab.map((item, index) => (
                <tr key={index} className="bg-white border-t border-gray-300">
                  <td className="min-w-15v max-w-15v p-1 text-gray-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_name_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-gray-100"
                          }`}
                        >
                          {item.soal_name ? (
                            <ItemsDataSoal
                              data={item.soal_name}
                              index={index}
                              uid={item.uuid}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.name}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-gray-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_tgl_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-gray-100"
                          }`}
                        >
                          {item.soal_tgl ? (
                            <ItemsDataSoal
                              data={item.soal_tgl}
                              index={index}
                              uid={item.uuid}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.tgl}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="min-w-15v max-w-15v p-1  text-gray-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_jumlah_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-gray-100"
                          }`}
                        >
                          {item.soal_jumlah ? (
                            <ItemsDataSoal
                              data={toRp(item.soal_jumlah)}
                              index={index}
                              uid={item.uuid}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {toRp(item.jumlah)}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                </tr>
              ))}
            <tr className="bg-white border-t border-gray-300 font-semibold">
              <td
                colSpan={2}
                className="p-1 text-gray-800 text-center border border-b  relative"
              >
                Jumlah
              </td>
              <td className="min-w-15v max-w-15v p-1  text-gray-800 text-center border border-b  relative">
                <div className="relative">
                  {toRp(sumBy(jawab, (r) => Number(r.jumlah)))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* SOAL END*/}

      {/* Jawab Start */}
      <div className="border border-dashed m-1">
        <div className="mt-1 ml-1 opacity-50 italic font-semibold ">
          Worksheet (Lembar Kerja):
        </div>
        {jawab &&
          jawab.map((item, j) => (
            <div key={j} className="my-3 ">
              <div className="p-5 border border-solid ">
                <div className="grid grid-cols-6 gap-0">
                  <div className="col-end-7 col-span-2 font-bold">
                    BUKU PEMBANTU{" "}
                    {item.jenis === "hutang" ? "HUTANG" : "PIUTANG"}
                  </div>
                  <div className="col-start-1 col-end-4 text-lg font-bold">
                    <div className="w-auto">CV TAMA</div>
                  </div>
                  <div className="col-end-7 col-span-2 flex items-center">
                    <span className="flex-none">
                      Nama {item.jenis === "hutang" ? "Pemasok" : "Pelanggan"} :
                    </span>
                    <div
                      className={`p-1 w-full ${
                        checking && item.err_name && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Droppable droppableId={"dst_name_" + item.uuid + "_1"}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-gray-100"
                            }`}
                          >
                            {item.jwb_name ? (
                              <ItemsDataSoal
                                data={find(jawab, { uuid: item.jwb_name }).name}
                                index={j}
                                uid={item.jwb_name}
                              />
                            ) : (
                              <span className="flex opacity-40 w-full text-center border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>

                <div className="border mt-5">
                  <table className="border-collapse min-w-full table-fixed">
                    <thead className="font-semibold">
                      <tr>
                        <th
                          rowSpan={2}
                          className="min-w-10v max-w-10v border py-1"
                        >
                          Tanggal
                        </th>
                        <th
                          rowSpan={2}
                          className="min-w-10v max-w-10v border py-1"
                        >
                          Keterangan
                        </th>
                        <th
                          rowSpan={2}
                          className="min-w-10v max-w-10v border py-1"
                        >
                          Ref.
                        </th>
                        <th
                          rowSpan={2}
                          className="min-w-15v max-w-15v border py-1"
                        >
                          Debit (Rp)
                        </th>
                        <th
                          rowSpan={2}
                          className="min-w-15v max-w-15v border py-1"
                        >
                          Kredit (Rp)
                        </th>
                        <th
                          colSpan={2}
                          className="min-w-15v max-w-15v border py-1"
                        >
                          Saldo
                        </th>
                      </tr>
                      <tr>
                        <th className="min-w-15v max-w-15v border py-1">
                          Debit
                        </th>
                        <th className="min-w-15v max-w-15v border py-1">
                          Kredit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className={`min-w-10v max-w-10v border py-1.5 ${
                            checking &&
                            item.err_tgl &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Droppable
                            droppableId={"dst_tgl_" + item.uuid + "_1"}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`w-full items-center p-0.5 ${
                                  snapshot.isDraggingOver && "bg-gray-100"
                                }`}
                              >
                                {item.jwb_tgl ? (
                                  <ItemsDataSoal
                                    data={
                                      find(jawab, { uuid: item.jwb_tgl }).tgl
                                    }
                                    index={j}
                                    uid={item.jwb_tgl}
                                  />
                                ) : (
                                  <span className="flex opacity-40 w-full text-center p-1 border border-dashed">
                                    Drop disini
                                  </span>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </td>
                        <td className="min-w-10v max-w-10v border py-1.5 text-center">
                          Pembelian
                        </td>
                        <td className="min-w-15v max-w-15v border py-1.5 text-center"></td>
                        <td className="min-w-15v max-w-15v border py-1.5">
                          &nbsp;
                        </td>
                        <td className="min-w-15v max-w-15v border py-1.5">
                          &nbsp;
                        </td>
                        <td
                          className={`min-w-15v max-w-15v border py-1.5 ${
                            checking &&
                            !item.jwb_jumlah_debit &&
                            !item.jwb_jumlah_kredit &&
                            " bg-red-300 animate-pulse"
                          } ${
                            checking &&
                            item.err_jumlah &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Droppable
                            droppableId={"dst_jumlah_" + item.uuid + "_debit_1"}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`w-full items-center p-0.5 ${
                                  snapshot.isDraggingOver && "bg-gray-100"
                                }`}
                              >
                                {item.jwb_jumlah_debit ? (
                                  <ItemsDataSoal
                                    data={toRp(
                                      find(jawab, {
                                        uuid: item.jwb_jumlah_debit,
                                      }).jumlah
                                    )}
                                    index={j}
                                    uid={item.jwb_jumlah_debit}
                                  />
                                ) : (
                                  <span className="flex opacity-40 w-full text-center p-1 border border-dashed">
                                    {!item.jwb_jumlah_kredit && "Drop disini"}
                                  </span>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </td>
                        <td
                          className={`min-w-15v max-w-15v border py-1.5 ${
                            checking &&
                            !item.jwb_jumlah_debit &&
                            !item.jwb_jumlah_kredit &&
                            " bg-red-300 animate-pulse"
                          } ${
                            checking &&
                            item.err_jumlah &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Droppable
                            droppableId={
                              "dst_jumlah_" + item.uuid + "_kredit_1"
                            }
                          >
                            {(provided, snapshot) => {
                              // console.log(provided);
                              // console.log(snapshot);
                              // console.log("snap:", item);
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`w-full items-center p-0.5 ${
                                    snapshot.isDraggingOver && "bg-gray-100"
                                  }`}
                                >
                                  {item.jwb_jumlah_kredit ? (
                                    <ItemsDataSoal
                                      data={toRp(
                                        find(jawab, {
                                          uuid: item.jwb_jumlah_kredit,
                                        }).jumlah
                                      )}
                                      index={j}
                                      uid={item.jwb_jumlah_kredit}
                                    />
                                  ) : (
                                    <span className="flex opacity-40 w-full text-center p-1 border border-dashed">
                                      {!item.jwb_jumlah_debit && "Drop disini"}
                                    </span>
                                  )}
                                  {provided.placeholder}
                                </div>
                              );
                            }}
                          </Droppable>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Jawab End */}
      <Toaster />
    </DragDropContext>
  );
}

export default App;
