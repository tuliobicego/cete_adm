import { Tag, Space, Tooltip, Table, TableColumnsType } from "antd";
import IconButton from "../../components/atoms/IconButton";
import { alumnStatusMap } from "../maps/status";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { alumnColorStatusMap, axisTypeColorMap } from "../maps/color";
import { IAlumn } from "../../types";
import { useNavigate } from "react-router";
import { stringToDateRed } from "../date/date";
import { axisTypeMap } from "../maps/type";
import { FaUser } from "react-icons/fa";


interface AlumnColumnsProps {
    alumns: IAlumn[]
}

const AlumnsTable: React.FC<AlumnColumnsProps> = ({ alumns }) => {

    const navigate = useNavigate()


    const alumnsColumns: TableColumnsType = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "CPF",
            dataIndex: "cpf",
            key: "cpf",
        },
        {
            title: "Data da Matrícula",
            dataIndex: "enrollmentDate",
            key: "enrollmentDate",
            sorter: (a, b) => stringToDateRed(a.enrollmentDate).getTime() - stringToDateRed(b.enrollmentDate).getTime(),
            sortDirections: ['descend'],
        },
        {
            title: "Turma",
            dataIndex: "axisType",
            key: "axisType",
            render: (axisType) => (
                axisType ? 
                <Tag
                color={axisTypeColorMap[axisType]}
                style={{
                    width: "100%",
                    textAlign: "center",
                    borderRadius: ".5rem",
                    fontSize: "16px",
                }}
                key={axisType}
                >
                {axisTypeMap[axisType]}
                </Tag>
                : null
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                color={alumnColorStatusMap[status]}
                style={{
                    width: "100%",
                    textAlign: "center",
                    borderRadius: ".5rem",
                    fontSize: "16px",
                }}
                key={status}
                >
                {alumnStatusMap[status]}
                </Tag>
            ),
        },
        {
            title: "",
            dataIndex: "",
            key: "",
            render: ({ getAlumn }) => (
                <Space size="middle">
                <Tooltip placement="bottom" title="Perfil">
                    <IconButton name="profile" onPress={getAlumn} icon={FaUser} />
                </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Table
          columns={alumnsColumns}
          dataSource={alumns?.map((alumn, index) => {

            const alumnAxis = alumn.axis?.filter((axis)=>axis.status === 'onCourse')
            const alumnCurrentAxis = alumn.status === "cancelled" || alumn.status === 'completed' ? '' : alumnAxis?.length ? alumnAxis.sort((a, b) => stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())[0]?.type : ''
            return {
              key: (index + 1).toString(),
              name: alumn.name,
              cpf: alumn.cpf,
              enrollmentDate: alumn.enrollmentDate,
              status: alumn.status,
              axisType: alumn.axis?.length ? alumnCurrentAxis : null,
              getAlumn: () => {
                navigate( "/alumnProfile", { state: {alumnId: alumn._id} });
              },
            };
          })}
          showSorterTooltip={{ target: 'sorter-icon' }}
          pagination={{ pageSize: 100 }}
          style={{ width: "100%", height: "100%" }}
        />
    )

}

export  default AlumnsTable