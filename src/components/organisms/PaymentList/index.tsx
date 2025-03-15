import React, { useState } from "react";
import { FaAngleRight, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { IPayment } from "../../../types/payment";
import IconButton from "../../atoms/IconButton";
import Input from "../../atoms/Input";
import CreatePaymentCard from "../../molecules/CreatePaymentCard";
import { ButtonsBox, FilterBox, Header } from "../styles";
import Select from "../../atoms/Select";
import { paymentStatusMap } from "../../../utils/maps/status";
import { Table, Tag, Space, Tooltip, DatePicker } from "antd";
import { useNavigate } from "react-router";
import { paymentTypeMap } from "../../../utils/maps/type";
import { paymentColorStatusMap, paymentColorTypeMap } from "../../../utils/maps/color";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import dayjs, { Dayjs } from "dayjs";
import { revertDatePicker } from "../../../utils/date/date";
const { RangePicker } = DatePicker

dayjs.locale("pt-br");

const columns = [
  {
    title: "Data do pagamento",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Mês",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={paymentColorTypeMap[type]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={type}
      >
        {paymentTypeMap[type].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Aluno",
    dataIndex: "alumn",
    key: "alumn",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={paymentColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {paymentStatusMap[status]}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ getPayment }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Perfil">
          <IconButton name="profile" onPress={getPayment} icon={ArrowRight} />
        </Tooltip>
      </Space>
    ),
  },
];

interface PaymentListProps {
  payments: IPayment[];
  filterByDate: boolean;
  filterByType: boolean;
  filterByAlumn: boolean;
  filterByStatus: boolean;
  add: boolean;
  refresh(): void
  setPayments(payments: IPayment[]): void
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, add, refresh, setPayments, filterByDate, filterByStatus, filterByAlumn, filterByType }) => {
  const [content, setContent] = useState<"add" | "">("");
  const [filteredPayment, setFilteredPayments] = useState<
    IPayment[] | undefined
  >(payments);
  const navigate = useNavigate();
  const paymentAlumnValues = [{ key: "", value: "Filtrar por aluno cursando" }].concat(
    payments.filter(payment=>payment.alumn?.status == "onCourse")?.map((payment, i) => {
      if (payment.alumn) {
        return { key: payment.alumn._id, value: payment.alumn.name};
      }
      return { key: "notFound", value: "-- Sem aluno --" };
    }).sort((a,b)=>a.value.localeCompare(b.value))
  );
  
  const paymentTypeValues = [{ key: "", value: "Filtrar por mensalidade" }].concat(
    payments.map((payment) => {
      return { key: payment.type, value: paymentTypeMap[payment.type] };
    })
  );

  const paymentStatusValues = [{ key: "", value: "Filtrar por status" }].concat(
    payments.map((payment) => {
      return { key: payment.status, value: paymentStatusMap[payment.status] };
    })
  );

  const changeDates = (dates: [Dayjs | null, Dayjs | null] | null, dateString: string | string[]) => {
    if(Array.isArray(dates) && dates.length === 2) {    
      setFilteredPayments(
            payments.filter((payment) => {
              const date = revertDatePicker(payment.date, "start")
              return date?.isAfter(dates[0]) && date.isBefore(dates[1])
            })
          )
      } else setFilteredPayments(payments);
    };
  
    const setFilteredByType = (key: string) => {
      key !== ""
        ? setFilteredPayments(
            payments.filter((payment) => {
              return payment.type === key;
            })
          )
        : setFilteredPayments(payments);
    };
  
  const setFilteredByStatus = (key: string) => {
    key !== ""
      ? setFilteredPayments(
          payments.filter((payment) => {
            return payment.status === key;
          })
        )
      : setFilteredPayments(payments);
  };
  const setFilteredByAlumn = (key: string) => {
    if (key === "") {
      setFilteredPayments(payments);
      return;
    }
    if (key === "notFound") {
      setFilteredPayments(
        payments.filter((payment) => {
          return !payment.alumn;
        })
      );
    }
    setFilteredPayments(
      payments.filter((payment) => {
        return payment.alumn?._id == key;
      })
    );
  };

  return (
    <Header>
      <h5 style={{ fontSize: "20px", width: "100%" }}>
        Paymentes encontrados: {filteredPayment?.length}
      </h5>
      {add && content === "add" && (
        <IconButton
          name="addPayment"
          icon={FaTimes}
          onPress={() => setContent("")}
        />
      )}
      <ButtonsBox>
        {content === "" && filterByDate && (
            <RangePicker
              format={"DD-MM-YYYY"}
              key="dateStart"
              locale={ptBR}
              style={{ width: "100%", height: '80%'}}
              onChange={changeDates}
              placeholder={["Filtro por intervalo", " datas"]}
              allowClear={true}
              showTime={false}
            />
          )}

        <FilterBox>
          {content === "add" ? <CreatePaymentCard payments={payments} setPayments={setPayments} refresh={refresh} /> : null}
          
          {content === "" && filterByAlumn &&  (
            <Select
              onSelect={setFilteredByAlumn}
              options={[
                ...new Map(
                  paymentAlumnValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}

          {content === "" && filterByType &&  (
            <Select
              onSelect={setFilteredByType}
              options={[
                ...new Map(
                  paymentTypeValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}

          {content === "" && filterByStatus && (
            <Select
              onSelect={setFilteredByStatus}
              options={[
                ...new Map(
                  paymentStatusValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
          
        </FilterBox>
        {add && content === "" && (
          <IconButton
            name="addPayment"
            icon={FaPlus}
            onPress={() => setContent("add")}
          />
        )}
      </ButtonsBox>
      {content === "" && filteredPayment && (
        <Table
          columns={columns}
          dataSource={filteredPayment?.map((payment, index) => {
            return {
              key: (index + 1).toString(),
              date: payment.date,
              type: payment.type,
              description: payment.description,
              status: payment.status,
              alumn: payment.alumn?.name,
              getPayment: () => {
                navigate( "/paymentDetails", { state: {paymentId: payment._id, alumnId: payment.alumn?._id} });
              },
            };
          })}
          pagination={{ pageSize: 100 }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Header>
  );
};

export default PaymentList;
