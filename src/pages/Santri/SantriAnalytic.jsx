import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Card, Container, Header } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import ChartBar from "../../components/moleculs/Chart/ChartBar";
import quran from "../../utils/Quran";

const SantriAnalytic = () => {
  const { user } = useContext(UserContext);
  const [subuh, setSubuh] = useState({ attend: 0, not_attend: 0 });
  const [duhur, setDuhur] = useState({ attend: 0, not_attend: 0 });
  const [asar, setAsar] = useState({ attend: 0, not_attend: 0 });
  const [maghrib, setMaghrib] = useState({ attend: 0, not_attend: 0 });
  const [isya, setIsya] = useState({ attend: 0, not_attend: 0 });
  const [hafalan, setHafalan] = useState({ juz: "", surat: "", ayat: "" });
  const [last, setLast] = useState({});

  const getJamaah = async () => {
    try {
      const { data } = await axios.get("santri/jamaah", config);
      if (!data.errors) {
        const s = data.data.progress.jamaah.filter((j) => j.kind === "subuh");
        const d = data.data.progress.jamaah.filter((j) => j.kind === "duhur");
        const a = data.data.progress.jamaah.filter((j) => j.kind === "asar");
        const m = data.data.progress.jamaah.filter((j) => j.kind === "maghrib");
        const i = data.data.progress.jamaah.filter((j) => j.kind === "isya");

        const getIsAttend = (tot, curr) => {
          return tot + (curr.is_attend ? 1 : 0);
        };

        const getNotAttend = (tot, curr) => {
          return tot + (curr.is_attend ? 0 : 1);
        };

        console.log(i.reduce(getIsAttend, 0));

        setSubuh({
          attend: s.reduce(getIsAttend, 0),
          not_attend: s.reduce(getNotAttend, 0),
        });
        setDuhur({
          attend: d.reduce(getIsAttend, 0),
          not_attend: d.reduce(getNotAttend, 0),
        });
        setAsar({
          attend: a.reduce(getIsAttend, 0),
          not_attend: a.reduce(getNotAttend, 0),
        });
        setMaghrib({
          attend: m.reduce(getIsAttend, 0),
          not_attend: m.reduce(getNotAttend, 0),
        });
        setIsya({
          attend: i.reduce(getIsAttend, 0),
          not_attend: i.reduce(getNotAttend, 0),
        });
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const getHafalan = async () => {
    try {
      const { data } = await axios.get("santri/hafalan", config);
      if (!data.errors) {
        const tmp = data.data.progress.hafalan;
        setHafalan({
          juz: tmp[tmp.length - 1].juz,
          surat: tmp[tmp.length - 1].surat,
          ayat: tmp[tmp.length - 1].ayat,
        });
        setLast(
          quran.find(
            (q) => parseInt(q.index) === parseInt(tmp[tmp.length - 1].surat)
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    getJamaah();
    getHafalan();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Header title="Analytics" desc="Helping you seeing progress" />
      <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="max-h-80 h-full flex flex-col">
          <p>Hafalan</p>
          <div className="m-auto flex justify-between items-center p-8 rounded-xl bg-blue-700 text-white">
            <p className="font-bold text-3xl">{last ? last.title : ""}</p>
            <div className="mx-8">
              <p className="text-lg">{`Juz ${hafalan.juz}`}</p>
              <p className="text-lg">{`Ayat ${hafalan.ayat}`}</p>
            </div>
          </div>
        </Card>
        <Card flow="max-h-80 h-full">
          <p>Shubuh</p>
          <ChartBar data={[subuh]} />
        </Card>
        <Card flow="max-h-80 h-full">
          <p>Dzuhur</p>
          <ChartBar data={[duhur]} />
        </Card>
        <Card flow="max-h-80 h-full">
          <p>Ashar</p>
          <ChartBar data={[asar]} />
        </Card>
        <Card flow="max-h-80 h-full">
          <p>Maghrib</p>
          <ChartBar data={[maghrib]} />
        </Card>
        <Card flow="max-h-80 h-full">
          <p>Isya</p>
          <ChartBar data={[isya]} />
        </Card>
      </div>
    </Container>
  );
};

export default SantriAnalytic;
