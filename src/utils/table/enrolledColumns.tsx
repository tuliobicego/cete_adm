import { Tag, Space, Tooltip, Table, TableColumnsType } from "antd";
import IconButton from "../../components/atoms/IconButton";
import { alumnStatusMap } from "../maps/status";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { alumnColorStatusMap } from "../maps/color";
import { IAlumn } from "../../types";
import { useNavigate } from "react-router";
import { stringToDateRed } from "../date/date";
import { axisTypeMap } from "../maps/type";
import { FaArchive, FaCheckCircle, FaFileArchive, FaTimes, FaTrash, FaUser, FaUserPlus } from "react-icons/fa";


interface EnrolledColumnsProps {
    enrolleds: IAlumn[]
    deleteAction(enrollment: IAlumn): void
}

const EnrolledsTable: React.FC<EnrolledColumnsProps> = ({ enrolleds, deleteAction }) => {

    const navigate = useNavigate()


    const enrolledsColumns: TableColumnsType = [
        {
            title: "Data da inscrição",
            dataIndex: "enrollmentDate",
            key: "enrollmentDate",
            sorter: (a, b) => stringToDateRed(a.enrollmentDate).getTime() - stringToDateRed(b.enrollmentDate).getTime(),
            sortDirections: ['descend'],
        },
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
            title: "Matricular",
            dataIndex: "",
            key: "",
            render: ({ createAlumn }) => (
                <Space size="middle">
                <Tooltip placement="bottom" title="Matricular">
                    <IconButton name="profile" onPress={createAlumn} icon={FaUserPlus} />
                </Tooltip>
                </Space>
            ),
        },
        {
            title: "Arquivar",
            dataIndex: "",
            key: "",
            render: ({ deleteAlumn }) => (
                <Space size="middle">
                <Tooltip placement="bottom" title="Descartar">
                    <IconButton name="delete" onPress={deleteAlumn} icon={FaArchive} />
                </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Table
          columns={enrolledsColumns}
          dataSource={enrolleds?.map((enrolled, index) => {
            return {
              key: (index + 1).toString(),
              name: enrolled.name,
              cpf: enrolled.cpf,
              enrollmentDate: enrolled.enrollmentDate,
              createAlumn: () => {
                navigate( "/createAlumnEnrolled", { state: {alumnId: enrolled._id} });
              },
              deleteAlumn: () => deleteAction(enrolled),
            };
          })}
          showSorterTooltip={{ target: 'sorter-icon' }}
          pagination={{ pageSize: 100, position: ['topRight'] }}
          style={{ width: "100%", overflow: 'scroll', marginTop: "2%" }}
        />
    )

}

export  default EnrolledsTable