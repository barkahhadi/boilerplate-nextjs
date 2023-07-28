/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Fri Jul 28 2023 7:53:26 PM
 * File: index.tsx
 * Description: Casl Utility
 */

import { Ability } from "@/constants/ability";
import {
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
  RawRule,
  Subject,
  SubjectRawRule,
  createMongoAbility,
} from "@casl/ability";

interface AccessData {
  module: string;
  permissions: string[];
}

interface PermissionData {
  application: string;
  ability: AccessData[];
}

export class Casl {
  public ability?: MongoAbility = null;
  public module?: string = null;

  constructor() {
    if (typeof window !== "undefined") {
      const ability = localStorage.getItem("ability");
      if (ability) {
        const parsedAbility: PermissionData[] = JSON.parse(
          ability
        ) as PermissionData[];

        if (parsedAbility.length > 0) {
          let abilityData: SubjectRawRule<
            string,
            ExtractSubjectType<Subject>,
            MongoQuery
          >[] = [];

          parsedAbility.forEach((data) => {
            data.ability.forEach((module) => {
              let canManage = false;
              module.permissions.forEach((permission) => {
                if (!permission) return;

                if (
                  [Ability.CREATE, Ability.UPDATE].includes(
                    permission as Ability
                  )
                ) {
                  canManage = true;
                }
                const rule: SubjectRawRule<
                  string,
                  ExtractSubjectType<Subject>,
                  MongoQuery
                > = {
                  subject: data.application + ":" + module.module,
                  action: permission,
                  conditions: {
                    published: true,
                  },
                };
                abilityData.push(rule);
              });
              if (canManage) {
                abilityData.push({
                  subject: data.application + ":" + module.module,
                  action: Ability.CREATE_OR_UPDATE,
                  conditions: {
                    published: false,
                  },
                });
              }
            });
          });
          this.ability = createMongoAbility(abilityData);
        }
      }
    }
  }

  public withModule(module: string) {
    this.module = module;
    return this;
  }

  public can(action: string, module: string = null) {
    if (!this.ability) return false;
    if (module !== null) {
      return this.ability.can(action, module);
    }
    return this.ability.can(action, this.module);
  }
}
