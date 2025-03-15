import { useState, useEffect, FormEvent } from "react";
import * as C from "./styles";
import { PhotoItem } from "../../atoms/PhotoItem";
import { DatePicker } from "antd";
import { Moment } from "moment";
import Loading from "../../atoms/Loading";
import NoData from "../../atoms/NoData";
import locale from "antd/lib/date-picker/locale/pt_BR";

interface GaleryPhotoProps {
  path: string;
}

const PhotoGalery: React.FC<GaleryPhotoProps> = ({ path }) => {
  const today = new Date();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [photos, setPhotos] = useState<Photo[]>([]);
  const [datePath, setDatePath] = useState<string>(
    `${today.getFullYear()}/${today.getMonth() + 1}`
  );

  useEffect(() => {
    console.log({ datePath });
    getAllPhotos(datePath);
  }, [datePath]);

  const getAllPhotos = async (datePath: string) => {
    setLoading(true);
    //setPhotos(await getPhotos(path + datePath));
    setLoading(false);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      let result //= await insertPhoto(file, path + datePath, file.name);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList //= [...photos];
        newPhotoList.push(result);
        //setPhotos(newPhotoList);
      }
    }
  };

  const changeMonth = (date: Moment | null, dateString: string | string[]) => {
    console.log({ date, dateString });
    //dateString instanceof String ? setDatePath(dateString.replace("-", "/")) : null;
  };

  const handleDeleteClick = async (name: string) => {
    //await deletePhoto(path + datePath, name);
    getAllPhotos(datePath);
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header>Comprovantes de pagamento: {datePath}</C.Header>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            alignSelf: "center",
          }}
        >
          <DatePicker
            locale={locale}
            picker="month"
            placeholder={`${today.getFullYear()}/${today.getMonth() + 1}`}
            style={{ width: "60%" }}
            onChange={changeMonth}
          />
        </div>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </C.UploadForm>

        {loading && (
          <C.ScreenWarning>
            <Loading />
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}

        {/*!loading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem
                key={index}
                url={item.url}
                name={item.name}
                onDelete={handleDeleteClick}
              />
            ))}
          </C.PhotoList>
            )*/}

        {/*!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <NoData />
          </C.ScreenWarning>
        )*/}
      </C.Area>
    </C.Container>
  );
};

export default PhotoGalery;
