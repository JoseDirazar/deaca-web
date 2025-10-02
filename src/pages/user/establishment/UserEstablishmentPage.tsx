import { useState } from "react";
import UserEstablishmentForm from "@/component/user/UserEstablishmentForm";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import Modal from "@/component/ui/Modal";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import type { Establishment } from "@/types/establishment/etablihment.interface";

export default function UserEstablishmentPage() {
  const { data: myEstablishments, isPending: isLoadingMine } =
    useEstablishmentApi().getMyEstablishments();

  const [showModal, setShowModal] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  
  console.log(myEstablishments);
  
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <UserEstablishmentsList
        setShowModal={setShowModal}
        isLoadingMine={isLoadingMine}
        myEstablishments={myEstablishments}
        onEdit={(establishment) => {
          setEditingEstablishment(establishment);
          setShowModal(true);
        }}
      />

      {showModal && (
        <Modal setIsOpen={(open) => {
          setShowModal(open);
          if (!open) setEditingEstablishment(null);
        }}>
          <UserEstablishmentForm 
            setShowModal={setShowModal} 
            editingEstablishment={editingEstablishment}
            onEditComplete={() => setEditingEstablishment(null)}
          />
        </Modal>
      )}
    </div>
  );
}
