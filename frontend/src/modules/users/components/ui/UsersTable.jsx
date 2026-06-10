// Hooks
import { useUsers } from "../../hooks/useUsers";
// Constantes
import { userStatus } from "../../constants/userStatus";
// Componentes
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
import ActionButtons from "../../../../globals/components/ui/ActionButtons";

export default function UsersTable({ openModal }) {
  const { users, loading } = useUsers();
  const noUsers = users.length === 0 && !loading;
  const isFirstLoad = users.length === 0 && loading;

  return (
    <div className="w-full h-full border rounded-2xl dark:border-[#17171a] dark:text-white">
      {noUsers && (
        <div
          className="flex flex-col items-center justify-center gap-1 rounded-2xl text-[#7E8088] bg-[#f5f3f6]
          dark:text-[#E4E2E5]"
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full">
            <Icon name={"border_clear"} size={60} />
          </div>

          <span className="text-xl font-medium text-center">
            No hay usuarios registrados
          </span>
        </div>
      )}

      {isFirstLoad ? (
        <Skeleton
          width="100%"
          height="100%"
          backgroundColor={"#F3EEF5"}
          darkModeBackgroundColor={"#101012"}
          shineColor="#C5C1C7"
          darkModeShineColor="#1e1e1e"
        />
      ) : (
        !noUsers && (
          <table className="h-full w-full">
            <thead className="sticky h-12 border-b dark:border-[#17171a]">
              <tr>
                <th className="font-medium text-sm pl-4 text-start">Rol</th>

                <th className="font-medium text-sm pl-4 text-start">Nombre</th>

                <th className="font-medium text-sm pl-4 text-start">
                  Primer apellido
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  Segundo apellido
                </th>
                <th className="font-medium text-sm pl-4 text-start">Correo</th>

                <th className="font-medium text-sm pl-4 text-start">
                  Fecha de creación
                </th>

                <th className="font-medium text-sm pl-4 text-start">Estado</th>
                <th className="font-medium text-sm pl-4 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="h-12 transition-colors duration-200
                  hover:bg-[#f5f3f6]
                  dark:hover:bg-[#17171a]"
                >
                  <th className="font-medium text-sm pl-4 text-start">
                    {user.role_name}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {user.name}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {user.first_surname}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {user.second_surname}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {user.email}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {user.created_at}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    <div
                      className={`w-fit flex items-center gap-1 py-0.5 px-2.5 rounded-2xl
                  ${userStatus[user.status]?.styles}`}
                    >
                      <Icon
                        name={userStatus[user.status]?.icon}
                        size={14}
                        fill={userStatus[user.status]?.fill}
                      />

                      <span>{userStatus[user.status]?.text}</span>
                    </div>
                  </th>

                  <th className="relative font-medium text-sm pl-4">
                    <ActionButtons
                      backgroundColor="#FFFFFF"
                      moreInfoButtonVisible={false}
                      editButtonId={`edit-user-${user.id}-button`}
                      editButtonOnClick={(e) =>
                        openModal(user, "editUser", e.currentTarget)
                      }
                      deleteButtonId={`delete-user-${user.id}-button`}
                      deleteButtonOnClick={(e) =>
                        openModal(
                          user,
                          userStatus[user.status]?.modalType,
                          e.currentTarget,
                        )
                      }
                    />
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
