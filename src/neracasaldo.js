import tw from "tailwind-styled-components";
import Dataneracasaldo from "./dataneracasaldo";

const Container = tw.div`
    flex
    flex-col 
    max-w-7xl
    mx-auto
    mt-10
    p-3
    border
    rounded
    shadow-md
`;
const Title = tw.h1`
    p-3
    mx-auto
    text-center
    text-2xl
    font-semibold
`;
const Subtitle = tw.h2`
    mx-auto
    text-xl
`;
const Headerrow = tw.div`
    flex 
    flex-row 
    justify-evenly
    border
    mt-5
`;
const Headerdata = tw.div`
    font-semibold 
    w-full
    py-3
    border
    border-gray-400
    text-center
`;
const Rowhasil = tw.div`
    flex 
    flex-row 
    justify-evenly
`;
const Colhasil = tw.div`
    font-semibold 
    w-full
    py-3
    ${(p) => p.$border && "border"}
    border-gray-200
    text-center
`;

function Neracasaldo() {
  const data = [
    { noakun: 101, namaakun: "Kas", nilai: 2000000, status: "debet" },
    {
      noakun: 103,
      namaakun: "Persediaan Barang Dagang",
      nilai: 500000,
      status: "debet",
    },
    {
      noakun: 104,
      namaakun: "Hutang Dagang",
      nilai: 100000,
      status: "kredit",
    },
    { noakun: 105, namaakun: "Modal PT", nilai: 700000, status: "kredit" },
    {
      noakun: 106,
      namaakun: "Prive PT",
      nilai: 1000000,
      status: "debet",
    },
    {
      noakun: 107,
      namaakun: "Return Penjualan",
      nilai: 400000,
      status: "debet",
    },
  ];
  return (
    <Container>
      <Title>PT XYZ</Title>
      <Subtitle>Neraca Saldo Periode Agustus 2021</Subtitle>
      <Headerrow>
        <Headerdata>Nomor Akun</Headerdata>
        <Headerdata>Nama Akun (Keterangan)</Headerdata>
        <Headerdata>?</Headerdata>
        <Headerdata>Debet</Headerdata>
        <Headerdata>Kredit</Headerdata>
      </Headerrow>
      {data.map((item, i) => (
        <Dataneracasaldo
          key={i}
          noakun={item.noakun}
          namaakun={item.namaakun}
          nilai={item.nilai}
          status={item.status}
        />
      ))}
      <Rowhasil>
        <Colhasil />
        <Colhasil />
        <Colhasil $border={true}>Total</Colhasil>
        <Colhasil $border={true} />
        <Colhasil $border={true} />
      </Rowhasil>
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
}
export default Neracasaldo;
