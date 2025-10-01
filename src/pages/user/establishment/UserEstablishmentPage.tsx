import { useState } from "react";
import UserEstablishmentForm from "@/component/user/UserEstablishmentForm";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import Modal from "@/component/ui/Modal";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";

export default function UserEstablishmentPage() {
  const { data: myEstablishments, isPending: isLoadingMine } =
    useEstablishmentApi().getMyEstablishments();

  const [showModal, setShowModal] = useState(false);
  console.log(myEstablishments);
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <UserEstablishmentsList
        setShowModal={setShowModal}
        isLoadingMine={isLoadingMine}
        myEstablishments={myEstablishments}
      />

      {showModal && (
        <Modal setIsOpen={setShowModal}>
          <UserEstablishmentForm setShowModal={setShowModal} />
        </Modal>
      )}
    </div>
  );
}
